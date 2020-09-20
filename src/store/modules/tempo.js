import { asyncTempoExportTask, awaitTempoExportTask } from "@/api/tempo";

const state = {
  taskId: ""
};

const mutations = {
  SET_TASK_ID: (state, taskId) => {
    state.taskId = taskId;
  }
};

const actions = {
  asyncExportTask({ commit }, formData) {
    const { millLineTag, startTime, endTime } = formData;
    console.log(millLineTag);
    console.log(startTime);
    console.log(endTime);
    return new Promise((resolve, reject) => {
      asyncTempoExportTask({
        millLineTag: millLineTag,
        startTime: startTime,
        endTime: endTime
      })
        .then(response => {
          const { data } = response;
          console.log(data);
          commit("SET_TASK_ID", data.taskId);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  awaitExportTask({ commit }, formData) {
    const { taskId } = formData;
    return new Promise((resolve, reject) => {
      awaitTempoExportTask({
        taskId: taskId
      })
        .then(response => {
          // const { data } = response;
          const data = response.data;
          console.log(data);
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
