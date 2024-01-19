
var loadWasm = (() => {
    var _scriptDir = import.meta.url;
    
    return (
  function(moduleArg = {}) {
  
  var Module=moduleArg;var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise((resolve,reject)=>{readyPromiseResolve=resolve;readyPromiseReject=reject});var moduleOverrides=Object.assign({},Module);var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var ENVIRONMENT_IS_WEB=true;var ENVIRONMENT_IS_WORKER=false;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary;if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(_scriptDir){scriptDirectory=_scriptDir}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1)}else{scriptDirectory=""}{read_=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=(url,onload,onerror)=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=()=>{if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.error.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];if(typeof WebAssembly!="object"){abort("no native wasm support detected")}var wasmMemory;var ABORT=false;var EXITSTATUS;var HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateMemoryViews(){var b=wasmMemory.buffer;Module["HEAP8"]=HEAP8=new Int8Array(b);Module["HEAP16"]=HEAP16=new Int16Array(b);Module["HEAPU8"]=HEAPU8=new Uint8Array(b);Module["HEAPU16"]=HEAPU16=new Uint16Array(b);Module["HEAP32"]=HEAP32=new Int32Array(b);Module["HEAPU32"]=HEAPU32=new Uint32Array(b);Module["HEAPF32"]=HEAPF32=new Float32Array(b);Module["HEAPF64"]=HEAPF64=new Float64Array(b)}var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}what="Aborted("+what+")";err(what);ABORT=true;EXITSTATUS=1;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix="data:application/octet-stream;base64,";var isDataURI=filename=>filename.startsWith(dataURIPrefix);var wasmBinaryFile;wasmBinaryFile="data:application/octet-stream;base64,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A0AgA0EAOgAAIANBAWohAyAGQQFrIgYNAAsgBEEBNgI4IARBfzYCFCAEIAA2AhAgBCABNgIIIAEgBEEIaiACKAIAQQEgASgCACgCHBEAACAEKAIgIgBBAUYEQCACIAQoAhg2AgALIABBAUYLIQcgBEFAayQAIAcLCgAgACABQQAQCgsEACAACwvnEQIAQYAIC9YRdW5zaWduZWQgc2hvcnQAdW5zaWduZWQgaW50AGZsb2F0AHVpbnQ2NF90AHVuc2lnbmVkIGNoYXIAYm9vbABlbXNjcmlwdGVuOjp2YWwAdW5zaWduZWQgbG9uZwBzdGQ6OndzdHJpbmcAc3RkOjpzdHJpbmcAc3RkOjp1MTZzdHJpbmcAc3RkOjp1MzJzdHJpbmcAZG91YmxlAHZvaWQAZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8c2hvcnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIHNob3J0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIGludD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8ZmxvYXQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQ4X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDhfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dWludDE2X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDE2X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQ2NF90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQ2NF90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8Y2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgY2hhcj4Ac3RkOjpiYXNpY19zdHJpbmc8dW5zaWduZWQgY2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8c2lnbmVkIGNoYXI+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGxvbmc+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIGxvbmc+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGRvdWJsZT4ATlN0M19fMjEyYmFzaWNfc3RyaW5nSWNOU18xMWNoYXJfdHJhaXRzSWNFRU5TXzlhbGxvY2F0b3JJY0VFRUUAAAAARAwAAEIHAABOU3QzX18yMTJiYXNpY19zdHJpbmdJaE5TXzExY2hhcl90cmFpdHNJaEVFTlNfOWFsbG9jYXRvckloRUVFRQAARAwAAIwHAABOU3QzX18yMTJiYXNpY19zdHJpbmdJd05TXzExY2hhcl90cmFpdHNJd0VFTlNfOWFsbG9jYXRvckl3RUVFRQAARAwAANQHAABOU3QzX18yMTJiYXNpY19zdHJpbmdJRHNOU18xMWNoYXJfdHJhaXRzSURzRUVOU185YWxsb2NhdG9ySURzRUVFRQAAAEQMAAAcCAAATlN0M19fMjEyYmFzaWNfc3RyaW5nSURpTlNfMTFjaGFyX3RyYWl0c0lEaUVFTlNfOWFsbG9jYXRvcklEaUVFRUUAAABEDAAAaAgAAE4xMGVtc2NyaXB0ZW4zdmFsRQAARAwAALQIAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0ljRUUAAEQMAADQCAAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJYUVFAABEDAAA+AgAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWhFRQAARAwAACAJAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lzRUUAAEQMAABICQAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJdEVFAABEDAAAcAkAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWlFRQAARAwAAJgJAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lqRUUAAEQMAADACQAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJbEVFAABEDAAA6AkAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SW1FRQAARAwAABAKAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0l4RUUAAEQMAAA4CgAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJeUVFAABEDAAAYAoAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWZFRQAARAwAAIgKAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lkRUUAAEQMAACwCgAATjEwX19jeHhhYml2MTE2X19zaGltX3R5cGVfaW5mb0UAAAAAbAwAANgKAADQDAAATjEwX19jeHhhYml2MTE3X19jbGFzc190eXBlX2luZm9FAAAAbAwAAAgLAAD8CgAAAAAAAHwLAAACAAAAAwAAAAQAAAAFAAAABgAAAE4xMF9fY3h4YWJpdjEyM19fZnVuZGFtZW50YWxfdHlwZV9pbmZvRQBsDAAAVAsAAPwKAAB2AAAAQAsAAIgLAABiAAAAQAsAAJQLAABjAAAAQAsAAKALAABoAAAAQAsAAKwLAABhAAAAQAsAALgLAABzAAAAQAsAAMQLAAB0AAAAQAsAANALAABpAAAAQAsAANwLAABqAAAAQAsAAOgLAABsAAAAQAsAAPQLAABtAAAAQAsAAAAMAAB4AAAAQAsAAAwMAAB5AAAAQAsAABgMAABmAAAAQAsAACQMAABkAAAAQAsAADAMAAAAAAAALAsAAAIAAAAHAAAABAAAAAUAAAAIAAAACQAAAAoAAAALAAAAAAAAALQMAAACAAAADAAAAAQAAAAFAAAACAAAAA0AAAAOAAAADwAAAE4xMF9fY3h4YWJpdjEyMF9fc2lfY2xhc3NfdHlwZV9pbmZvRQAAAABsDAAAjAwAACwLAABTdDl0eXBlX2luZm8AAAAARAwAAMAMAEHYGQsDkA8B";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinarySync(file){if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}var binary=tryParseAsDataURI(file);if(binary){return binary}if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}function getBinaryPromise(binaryFile){return Promise.resolve().then(()=>getBinarySync(binaryFile))}function instantiateArrayBuffer(binaryFile,imports,receiver){return getBinaryPromise(binaryFile).then(binary=>WebAssembly.instantiate(binary,imports)).then(instance=>instance).then(receiver,reason=>{err(`failed to asynchronously prepare wasm: ${reason}`);abort(reason)})}function instantiateAsync(binary,binaryFile,imports,callback){return instantiateArrayBuffer(binaryFile,imports,callback)}function createWasm(){var info={"a":wasmImports};function receiveInstance(instance,module){wasmExports=instance.exports;wasmMemory=wasmExports["k"];updateMemoryViews();addOnInit(wasmExports["l"]);removeRunDependency("wasm-instantiate");return wasmExports}addRunDependency("wasm-instantiate");function receiveInstantiationResult(result){receiveInstance(result["instance"])}if(Module["instantiateWasm"]){try{return Module["instantiateWasm"](info,receiveInstance)}catch(e){err(`Module.instantiateWasm callback failed with error: ${e}`);readyPromiseReject(e)}}instantiateAsync(wasmBinary,wasmBinaryFile,info,receiveInstantiationResult).catch(readyPromiseReject);return{}}var callRuntimeCallbacks=callbacks=>{while(callbacks.length>0){callbacks.shift()(Module)}};var noExitRuntime=Module["noExitRuntime"]||true;var __embind_register_bigint=(primitiveType,name,size,minRange,maxRange)=>{};var embind_init_charCodes=()=>{var codes=new Array(256);for(var i=0;i<256;++i){codes[i]=String.fromCharCode(i)}embind_charCodes=codes};var embind_charCodes;var readLatin1String=ptr=>{var ret="";var c=ptr;while(HEAPU8[c]){ret+=embind_charCodes[HEAPU8[c++]]}return ret};var awaitingDependencies={};var registeredTypes={};var typeDependencies={};var BindingError;var throwBindingError=message=>{throw new BindingError(message)};var InternalError;function sharedRegisterType(rawType,registeredInstance,options={}){var name=registeredInstance.name;if(!rawType){throwBindingError(`type "${name}" must have a positive integer typeid pointer`)}if(registeredTypes.hasOwnProperty(rawType)){if(options.ignoreDuplicateRegistrations){return}else{throwBindingError(`Cannot register type '${name}' twice`)}}registeredTypes[rawType]=registeredInstance;delete typeDependencies[rawType];if(awaitingDependencies.hasOwnProperty(rawType)){var callbacks=awaitingDependencies[rawType];delete awaitingDependencies[rawType];callbacks.forEach(cb=>cb())}}function registerType(rawType,registeredInstance,options={}){if(!("argPackAdvance"in registeredInstance)){throw new TypeError("registerType registeredInstance requires argPackAdvance")}return sharedRegisterType(rawType,registeredInstance,options)}var GenericWireTypeSize=8;var __embind_register_bool=(rawType,name,trueValue,falseValue)=>{name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(wt){return!!wt},"toWireType":function(destructors,o){return o?trueValue:falseValue},"argPackAdvance":GenericWireTypeSize,"readValueFromPointer":function(pointer){return this["fromWireType"](HEAPU8[pointer])},destructorFunction:null})};function handleAllocatorInit(){Object.assign(HandleAllocator.prototype,{get(id){return this.allocated[id]},has(id){return this.allocated[id]!==undefined},allocate(handle){var id=this.freelist.pop()||this.allocated.length;this.allocated[id]=handle;return id},free(id){this.allocated[id]=undefined;this.freelist.push(id)}})}function HandleAllocator(){this.allocated=[undefined];this.freelist=[]}var emval_handles=new HandleAllocator;var __emval_decref=handle=>{if(handle>=emval_handles.reserved&&0===--emval_handles.get(handle).refcount){emval_handles.free(handle)}};var count_emval_handles=()=>{var count=0;for(var i=emval_handles.reserved;i<emval_handles.allocated.length;++i){if(emval_handles.allocated[i]!==undefined){++count}}return count};var init_emval=()=>{emval_handles.allocated.push({value:undefined},{value:null},{value:true},{value:false});emval_handles.reserved=emval_handles.allocated.length;Module["count_emval_handles"]=count_emval_handles};var Emval={toValue:handle=>{if(!handle){throwBindingError("Cannot use deleted val. handle = "+handle)}return emval_handles.get(handle).value},toHandle:value=>{switch(value){case undefined:return 1;case null:return 2;case true:return 3;case false:return 4;default:{return emval_handles.allocate({refcount:1,value:value})}}}};function simpleReadValueFromPointer(pointer){return this["fromWireType"](HEAP32[pointer>>2])}var __embind_register_emval=(rawType,name)=>{name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":handle=>{var rv=Emval.toValue(handle);__emval_decref(handle);return rv},"toWireType":(destructors,value)=>Emval.toHandle(value),"argPackAdvance":GenericWireTypeSize,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:null})};var floatReadValueFromPointer=(name,width)=>{switch(width){case 4:return function(pointer){return this["fromWireType"](HEAPF32[pointer>>2])};case 8:return function(pointer){return this["fromWireType"](HEAPF64[pointer>>3])};default:throw new TypeError(`invalid float width (${width}): ${name}`)}};var __embind_register_float=(rawType,name,size)=>{name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":value=>value,"toWireType":(destructors,value)=>value,"argPackAdvance":GenericWireTypeSize,"readValueFromPointer":floatReadValueFromPointer(name,size),destructorFunction:null})};var integerReadValueFromPointer=(name,width,signed)=>{switch(width){case 1:return signed?pointer=>HEAP8[pointer>>0]:pointer=>HEAPU8[pointer>>0];case 2:return signed?pointer=>HEAP16[pointer>>1]:pointer=>HEAPU16[pointer>>1];case 4:return signed?pointer=>HEAP32[pointer>>2]:pointer=>HEAPU32[pointer>>2];default:throw new TypeError(`invalid integer width (${width}): ${name}`)}};var __embind_register_integer=(primitiveType,name,size,minRange,maxRange)=>{name=readLatin1String(name);if(maxRange===-1){maxRange=4294967295}var fromWireType=value=>value;if(minRange===0){var bitshift=32-8*size;fromWireType=value=>value<<bitshift>>>bitshift}var isUnsignedType=name.includes("unsigned");var checkAssertions=(value,toTypeName)=>{};var toWireType;if(isUnsignedType){toWireType=function(destructors,value){checkAssertions(value,this.name);return value>>>0}}else{toWireType=function(destructors,value){checkAssertions(value,this.name);return value}}registerType(primitiveType,{name:name,"fromWireType":fromWireType,"toWireType":toWireType,"argPackAdvance":GenericWireTypeSize,"readValueFromPointer":integerReadValueFromPointer(name,size,minRange!==0),destructorFunction:null})};var __embind_register_memory_view=(rawType,dataTypeIndex,name)=>{var typeMapping=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array];var TA=typeMapping[dataTypeIndex];function decodeMemoryView(handle){var size=HEAPU32[handle>>2];var data=HEAPU32[handle+4>>2];return new TA(HEAP8.buffer,data,size)}name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":decodeMemoryView,"argPackAdvance":GenericWireTypeSize,"readValueFromPointer":decodeMemoryView},{ignoreDuplicateRegistrations:true})};function readPointer(pointer){return this["fromWireType"](HEAPU32[pointer>>2])}var stringToUTF8Array=(str,heap,outIdx,maxBytesToWrite)=>{if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}}heap[outIdx]=0;return outIdx-startIdx};var stringToUTF8=(str,outPtr,maxBytesToWrite)=>stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite);var lengthBytesUTF8=str=>{var len=0;for(var i=0;i<str.length;++i){var c=str.charCodeAt(i);if(c<=127){len++}else if(c<=2047){len+=2}else if(c>=55296&&c<=57343){len+=4;++i}else{len+=3}}return len};var UTF8Decoder=typeof TextDecoder!="undefined"?new TextDecoder("utf8"):undefined;var UTF8ArrayToString=(heapOrArray,idx,maxBytesToRead)=>{var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heapOrArray[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}return str};var UTF8ToString=(ptr,maxBytesToRead)=>ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):"";var __embind_register_std_string=(rawType,name)=>{name=readLatin1String(name);var stdStringIsUTF8=name==="std::string";registerType(rawType,{name:name,"fromWireType"(value){var length=HEAPU32[value>>2];var payload=value+4;var str;if(stdStringIsUTF8){var decodeStartPtr=payload;for(var i=0;i<=length;++i){var currentBytePtr=payload+i;if(i==length||HEAPU8[currentBytePtr]==0){var maxRead=currentBytePtr-decodeStartPtr;var stringSegment=UTF8ToString(decodeStartPtr,maxRead);if(str===undefined){str=stringSegment}else{str+=String.fromCharCode(0);str+=stringSegment}decodeStartPtr=currentBytePtr+1}}}else{var a=new Array(length);for(var i=0;i<length;++i){a[i]=String.fromCharCode(HEAPU8[payload+i])}str=a.join("")}_free(value);return str},"toWireType"(destructors,value){if(value instanceof ArrayBuffer){value=new Uint8Array(value)}var length;var valueIsOfTypeString=typeof value=="string";if(!(valueIsOfTypeString||value instanceof Uint8Array||value instanceof Uint8ClampedArray||value instanceof Int8Array)){throwBindingError("Cannot pass non-string to std::string")}if(stdStringIsUTF8&&valueIsOfTypeString){length=lengthBytesUTF8(value)}else{length=value.length}var base=_malloc(4+length+1);var ptr=base+4;HEAPU32[base>>2]=length;if(stdStringIsUTF8&&valueIsOfTypeString){stringToUTF8(value,ptr,length+1)}else{if(valueIsOfTypeString){for(var i=0;i<length;++i){var charCode=value.charCodeAt(i);if(charCode>255){_free(ptr);throwBindingError("String has UTF-16 code units that do not fit in 8 bits")}HEAPU8[ptr+i]=charCode}}else{for(var i=0;i<length;++i){HEAPU8[ptr+i]=value[i]}}}if(destructors!==null){destructors.push(_free,base)}return base},"argPackAdvance":GenericWireTypeSize,"readValueFromPointer":readPointer,destructorFunction(ptr){_free(ptr)}})};var UTF16Decoder=typeof TextDecoder!="undefined"?new TextDecoder("utf-16le"):undefined;var UTF16ToString=(ptr,maxBytesToRead)=>{var endPtr=ptr;var idx=endPtr>>1;var maxIdx=idx+maxBytesToRead/2;while(!(idx>=maxIdx)&&HEAPU16[idx])++idx;endPtr=idx<<1;if(endPtr-ptr>32&&UTF16Decoder)return UTF16Decoder.decode(HEAPU8.subarray(ptr,endPtr));var str="";for(var i=0;!(i>=maxBytesToRead/2);++i){var codeUnit=HEAP16[ptr+i*2>>1];if(codeUnit==0)break;str+=String.fromCharCode(codeUnit)}return str};var stringToUTF16=(str,outPtr,maxBytesToWrite)=>{if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647}if(maxBytesToWrite<2)return 0;maxBytesToWrite-=2;var startPtr=outPtr;var numCharsToWrite=maxBytesToWrite<str.length*2?maxBytesToWrite/2:str.length;for(var i=0;i<numCharsToWrite;++i){var codeUnit=str.charCodeAt(i);HEAP16[outPtr>>1]=codeUnit;outPtr+=2}HEAP16[outPtr>>1]=0;return outPtr-startPtr};var lengthBytesUTF16=str=>str.length*2;var UTF32ToString=(ptr,maxBytesToRead)=>{var i=0;var str="";while(!(i>=maxBytesToRead/4)){var utf32=HEAP32[ptr+i*4>>2];if(utf32==0)break;++i;if(utf32>=65536){var ch=utf32-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}else{str+=String.fromCharCode(utf32)}}return str};var stringToUTF32=(str,outPtr,maxBytesToWrite)=>{if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647}if(maxBytesToWrite<4)return 0;var startPtr=outPtr;var endPtr=startPtr+maxBytesToWrite-4;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343){var trailSurrogate=str.charCodeAt(++i);codeUnit=65536+((codeUnit&1023)<<10)|trailSurrogate&1023}HEAP32[outPtr>>2]=codeUnit;outPtr+=4;if(outPtr+4>endPtr)break}HEAP32[outPtr>>2]=0;return outPtr-startPtr};var lengthBytesUTF32=str=>{var len=0;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343)++i;len+=4}return len};var __embind_register_std_wstring=(rawType,charSize,name)=>{name=readLatin1String(name);var decodeString,encodeString,getHeap,lengthBytesUTF,shift;if(charSize===2){decodeString=UTF16ToString;encodeString=stringToUTF16;lengthBytesUTF=lengthBytesUTF16;getHeap=()=>HEAPU16;shift=1}else if(charSize===4){decodeString=UTF32ToString;encodeString=stringToUTF32;lengthBytesUTF=lengthBytesUTF32;getHeap=()=>HEAPU32;shift=2}registerType(rawType,{name:name,"fromWireType":value=>{var length=HEAPU32[value>>2];var HEAP=getHeap();var str;var decodeStartPtr=value+4;for(var i=0;i<=length;++i){var currentBytePtr=value+4+i*charSize;if(i==length||HEAP[currentBytePtr>>shift]==0){var maxReadBytes=currentBytePtr-decodeStartPtr;var stringSegment=decodeString(decodeStartPtr,maxReadBytes);if(str===undefined){str=stringSegment}else{str+=String.fromCharCode(0);str+=stringSegment}decodeStartPtr=currentBytePtr+charSize}}_free(value);return str},"toWireType":(destructors,value)=>{if(!(typeof value=="string")){throwBindingError(`Cannot pass non-string to C++ string type ${name}`)}var length=lengthBytesUTF(value);var ptr=_malloc(4+length+charSize);HEAPU32[ptr>>2]=length>>shift;encodeString(value,ptr+4,length+charSize);if(destructors!==null){destructors.push(_free,ptr)}return ptr},"argPackAdvance":GenericWireTypeSize,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction(ptr){_free(ptr)}})};var __embind_register_void=(rawType,name)=>{name=readLatin1String(name);registerType(rawType,{isVoid:true,name:name,"argPackAdvance":0,"fromWireType":()=>undefined,"toWireType":(destructors,o)=>undefined})};var getHeapMax=()=>2147483648;var growMemory=size=>{var b=wasmMemory.buffer;var pages=(size-b.byteLength+65535)/65536;try{wasmMemory.grow(pages);updateMemoryViews();return 1}catch(e){}};var _emscripten_resize_heap=requestedSize=>{var oldSize=HEAPU8.length;requestedSize>>>=0;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}var alignUp=(x,multiple)=>x+(multiple-x%multiple)%multiple;for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=growMemory(newSize);if(replacement){return true}}return false};embind_init_charCodes();BindingError=Module["BindingError"]=class BindingError extends Error{constructor(message){super(message);this.name="BindingError"}};InternalError=Module["InternalError"]=class InternalError extends Error{constructor(message){super(message);this.name="InternalError"}};handleAllocatorInit();init_emval();var wasmImports={f:__embind_register_bigint,i:__embind_register_bool,h:__embind_register_emval,e:__embind_register_float,b:__embind_register_integer,a:__embind_register_memory_view,d:__embind_register_std_string,c:__embind_register_std_wstring,j:__embind_register_void,g:_emscripten_resize_heap};var wasmExports=createWasm();var ___wasm_call_ctors=()=>(___wasm_call_ctors=wasmExports["l"])();var _evaluate=Module["_evaluate"]=(a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)=>(_evaluate=Module["_evaluate"]=wasmExports["m"])(a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12);var ___getTypeName=a0=>(___getTypeName=wasmExports["__getTypeName"])(a0);var __embind_initialize_bindings=Module["__embind_initialize_bindings"]=()=>(__embind_initialize_bindings=Module["__embind_initialize_bindings"]=wasmExports["n"])();var ___errno_location=()=>(___errno_location=wasmExports["__errno_location"])();var _malloc=Module["_malloc"]=a0=>(_malloc=Module["_malloc"]=wasmExports["p"])(a0);var _free=Module["_free"]=a0=>(_free=Module["_free"]=wasmExports["q"])(a0);function intArrayFromBase64(s){var decoded=atob(s);var bytes=new Uint8Array(decoded.length);for(var i=0;i<decoded.length;++i){bytes[i]=decoded.charCodeAt(i)}return bytes}function tryParseAsDataURI(filename){if(!isDataURI(filename)){return}return intArrayFromBase64(filename.slice(dataURIPrefix.length))}var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(){if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}run();
  
  
    return moduleArg.ready
  }
  
  );
  })();
  export default loadWasm;