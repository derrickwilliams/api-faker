/*
* @Author: CJ Ting
* @Date:   2017-03-28 18:22:14
* @Last Modified by:   CJ Ting
* @Last Modified time: 2017-04-12 18:53:35
 */

// API Faker creates a server based on a yaml config file
package main

import (
	"io/ioutil"
	"mime"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	"gopkg.in/alecthomas/kingpin.v2"

	log "github.com/Sirupsen/logrus"
	"gopkg.in/yaml.v2"
)

const watchDuration = 500 * time.Millisecond

var (
	port       int
	configPath string

	// protect items
	mutex sync.Mutex
	items []*Item
)

var appVersion string // set by -ldflags

var configDir string // config file dir

type Item struct {
	Path string
	// default value: "GET"
	Method  string
	Body    string
	Headers map[string]string
	Query   map[string]string
	// default value: 200
	Code int
	File string
}

func (item *Item) Matched(path string, method string, query url.Values) bool {
	if item.Path != path {
		return false
	}

	if item.getMethod() != method {
		return false
	}

	if item.Query != nil {
		for k, v := range item.Query {
			if query.Get(k) != v {
				return false
			}
		}
	}
	return true
}

func (item *Item) getMethod() string {
	m := strings.ToUpper(item.Method)
	if m == "" {
		m = "GET"
	}
	return m
}

func (item *Item) getCode() int {
	c := item.Code
	if c == 0 {
		c = 200
	}
	return c
}

func init() {
	log.SetFormatter(&log.TextFormatter{
		FullTimestamp: true,
	})
}

func parseFlags() {
	kingpin.Flag("port", "listening port").Default("3232").IntVar(&port)
	kingpin.Version(appVersion)
	kingpin.CommandLine.HelpFlag.Short('h')

	kingpin.Arg("config", "config file").Required().StringVar(&configPath)

	kingpin.Parse()
}

func parseConfig(buf []byte) {
	mutex.Lock()
	defer mutex.Unlock()
	if err := yaml.Unmarshal(buf, &items); err != nil {
		log.WithError(err).Fatal("Failed to parse config")
	} else {
		log.Info("Parse config successfully")
	}
}

func main() {
	parseFlags()

	buf, err := ioutil.ReadFile(configPath)
	if err != nil {
		log.WithError(err).
			WithField("config", configPath).
			Fatal("Failed to read file")
	}

	configAbsPath, err := filepath.Abs(configPath)
	if err != nil {
		log.WithError(err).Fatal("Failed to get config abs path")
	}
	configDir = filepath.Dir(configAbsPath)

	parseConfig(buf)

	// watch config file
	go watchConfig()

	server := createServer()

	log.WithField("port", port).Info("Server started")

	log.WithError(http.ListenAndServe(":"+strconv.Itoa(port), server)).Fatal("Server crashed")
}

func createServer() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		status := http.StatusOK
		url := r.URL.String()
		path := r.URL.Path

		// log
		defer func() {
			log.WithFields(log.Fields{
				"method": r.Method,
				"code":   status,
			}).Info(url)
		}()

		var target *Item

		mutex.Lock()
		for _, item := range items {
			if item.Matched(path, r.Method, r.URL.Query()) {
				target = item
				break
			}
		}
		mutex.Unlock()

		if target == nil {
			status = http.StatusNotFound
			w.WriteHeader(status)
			return
		}

		status = target.getCode()

		// write headers
		for k, v := range target.Headers {
			w.Header().Set(k, v)
		}

		// set MIME content type
		if target.File != "" {
			mime := mime.TypeByExtension(filepath.Ext(target.File))
			w.Header().Set("Content-Type", mime)
		}

		var buf []byte

		// write body
		if target.File != "" {
			var err error
			filePath := target.File
			if !filepath.IsAbs(filePath) {
				filePath = filepath.Join(configDir, filePath)
			}
			buf, err = ioutil.ReadFile(filePath)
			if err != nil {
				log.WithError(err).WithFields(log.Fields{
					"url":  url,
					"file": target.File,
				}).
					Error("Failed to read file")
				status = http.StatusInternalServerError
			}
		} else {
			buf = []byte(target.Body)
		}

		w.WriteHeader(status)
		w.Write(buf)
	})
}

func watchConfig() {
	lastModTime := time.Now()
	for {
		stat, err := os.Stat(configPath)
		if err != nil {
			log.WithError(err).WithField("config", configPath).Error("Can't get config stat")
		} else {
			if stat.ModTime().After(lastModTime) {
				lastModTime = stat.ModTime()
				log.Info("Detect config file updated, reparse...")
				buf, err := ioutil.ReadFile(configPath)
				if err != nil {
					log.WithError(err).WithField("config", configPath).Error("Can't read config file")
				} else {
					parseConfig(buf)
				}
			}
		}

		time.Sleep(watchDuration)
	}
}
