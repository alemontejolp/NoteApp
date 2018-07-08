package util

import (
	"strings"
)

/*CleanPath clean the path privided.
 *Chekc: https://golang.org/pkg/strings/#NewReplacer or
 *https://golang.org/pkg/strings/#Replace for
 *more information.
 */
func CleanPath(s string) string {
	r := strings.NewReplacer("/..", "", "\\..", "")
	return r.Replace(s)
}
