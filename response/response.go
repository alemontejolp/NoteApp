package response

//Response is a structure used to response to http request.
type Response struct {
	Status   int         `json:"status"`
	Success  bool        `json:"success"`
	Message  string      `json:"message"`
	DataType string      `json:"data_type"`
	Data     interface{} `json:"data"`
}
