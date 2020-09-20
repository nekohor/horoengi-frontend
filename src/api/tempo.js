import request from "@/utils/request";

export function asyncTempoExportTask(data) {
  console.log(data);
  return request({
    url: "/tempo/export/task/async",
    method: "post",
    data
  });
}

export function awaitTempoExportTask(data) {
  return request({
    url: "/tempo/export/task/await",
    method: "post",
    data
  });
}
