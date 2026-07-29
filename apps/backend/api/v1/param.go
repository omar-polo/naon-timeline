package api

import "strconv"

func boolparam(fc NoBody, name string) (bool, error) {
	if !fc.Request().URL.Query().Has(name) {
		return false, nil
	}
	return strconv.ParseBool(fc.Request().URL.Query().Get(name))
}
