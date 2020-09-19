import request from "@/utils/request";

export function asyncTempoExportTask(data) {
  return request({
    url: "/tempo/export/task",
    method: "get",
    data
  });
}

export function awaitTempoExportTask(data) {
  return request({
    url: "/tempo/export/task",
    method: "post",
    data
  });
}
