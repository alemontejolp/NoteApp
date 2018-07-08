//Response is a base class to format the server response.
class Response {
  constructor(res = {}) {
    this.status = res.status || 200,
    this.success = res.success || true,
    this.message = res.message || "OK"
    this.data_type = res.data_type || "null"
    this.data = res.data || null
  }
}

function genBadResponse(data, message, status) {
  let type = typeof data;
  if(type === "object" && data instanceof Array) {
    type = "array"
  }
  return new Response({
    "status": status || 500,
    "success": false,
    "message": message,
    "data_type": type,
    "data": data
  });
}