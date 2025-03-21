import "./chunk-OCBYBPSH.js";

// node_modules/@ffmpeg/util/dist/esm/errors.js
var ERROR_RESPONSE_BODY_READER = new Error("failed to get response body reader");
var ERROR_INCOMPLETED_DOWNLOAD = new Error("failed to complete download");

// node_modules/@ffmpeg/util/dist/esm/const.js
var HeaderContentLength = "Content-Length";

// node_modules/@ffmpeg/util/dist/esm/index.js
var readFromBlobOrFile = (blob) => new Promise((resolve, reject) => {
  const fileReader = new FileReader();
  fileReader.onload = () => {
    const { result } = fileReader;
    if (result instanceof ArrayBuffer) {
      resolve(new Uint8Array(result));
    } else {
      resolve(new Uint8Array());
    }
  };
  fileReader.onerror = (event) => {
    var _a, _b;
    reject(Error(`File could not be read! Code=${((_b = (_a = event == null ? void 0 : event.target) == null ? void 0 : _a.error) == null ? void 0 : _b.code) || -1}`));
  };
  fileReader.readAsArrayBuffer(blob);
});
var fetchFile = async (file) => {
  let data;
  if (typeof file === "string") {
    if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(file)) {
      data = atob(file.split(",")[1]).split("").map((c) => c.charCodeAt(0));
    } else {
      data = await (await fetch(file)).arrayBuffer();
    }
  } else if (file instanceof URL) {
    data = await (await fetch(file)).arrayBuffer();
  } else if (file instanceof File || file instanceof Blob) {
    data = await readFromBlobOrFile(file);
  } else {
    return new Uint8Array();
  }
  return new Uint8Array(data);
};
var importScript = async (url) => new Promise((resolve) => {
  const script = document.createElement("script");
  const eventHandler = () => {
    script.removeEventListener("load", eventHandler);
    resolve();
  };
  script.src = url;
  script.type = "text/javascript";
  script.addEventListener("load", eventHandler);
  document.getElementsByTagName("head")[0].appendChild(script);
});
var downloadWithProgress = async (url, cb) => {
  var _a;
  const resp = await fetch(url);
  let buf;
  try {
    const total = parseInt(resp.headers.get(HeaderContentLength) || "-1");
    const reader = (_a = resp.body) == null ? void 0 : _a.getReader();
    if (!reader)
      throw ERROR_RESPONSE_BODY_READER;
    const chunks = [];
    let received = 0;
    for (; ; ) {
      const { done, value } = await reader.read();
      const delta = value ? value.length : 0;
      if (done) {
        if (total != -1 && total !== received)
          throw ERROR_INCOMPLETED_DOWNLOAD;
        cb && cb({ url, total, received, delta, done });
        break;
      }
      chunks.push(value);
      received += delta;
      cb && cb({ url, total, received, delta, done });
    }
    const data = new Uint8Array(received);
    let position = 0;
    for (const chunk of chunks) {
      data.set(chunk, position);
      position += chunk.length;
    }
    buf = data.buffer;
  } catch (e) {
    console.log(`failed to send download progress event: `, e);
    buf = await resp.arrayBuffer();
    cb && cb({
      url,
      total: buf.byteLength,
      received: buf.byteLength,
      delta: 0,
      done: true
    });
  }
  return buf;
};
var toBlobURL = async (url, mimeType, progress = false, cb) => {
  const buf = progress ? await downloadWithProgress(url, cb) : await (await fetch(url)).arrayBuffer();
  const blob = new Blob([buf], { type: mimeType });
  return URL.createObjectURL(blob);
};
export {
  downloadWithProgress,
  fetchFile,
  importScript,
  toBlobURL
};
//# sourceMappingURL=@ffmpeg_util.js.map
