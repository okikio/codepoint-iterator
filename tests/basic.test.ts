import { hasutf8-uint8array, getutf8-uint8array } from "../src";
import { describe, expect, it } from 'vitest';
import { encode } from './utils/index';

const uint8 = encode("Lorem Ipsium");
const { buffer: arrbuf } = uint8;

const int8 = new Int8Array(uint8);
const uint8c = new Uint8ClampedArray(uint8)
const int16 = new Int16Array(uint8);
const uint16 = new Uint16Array(uint8);
const int32 = new Int32Array(uint8);
const uint32 = new Uint32Array(uint8);
const float32 = new Float32Array(uint8);
const float64 = new Float64Array(uint8);

const complexTypedArrObj = {
  int8: int8,
  uint8_uint8c: [uint8, uint8c],
  float32_float64_uint32_int32_uint16_int16_uint8obj: {
    float32_float64_obj: [
      float32,
      float64,
      {
        float32_float64_int16_int32: [float32, float64, int16, int32]
      }
    ],
    uint32: [uint32],
    uint16_float32: [uint16, float32],
    uint16_obj_int16: [
      uint16,
      {
        arrbuf: [arrbuf]
      },
      int16,
    ],
    obj_uin8_uint16: [
      {
        arrbuf_uint8_uint16: [arrbuf, uint8, uint16]
      },
      uint8,
      uint16
    ]
  },
  arrbuf: arrbuf,
  arrbuf_obj: {
    buf: arrbuf
  },
  arrbuf_float32: [arrbuf, float32]
}

const channel = new MessageChannel();
const ports = [channel.port1, channel.port2];

const streams = {
  readonly: new ReadableStream(),
  writeonly: new WritableStream(),
  tranformonly: new TransformStream()
}

// No polyfill for OffscreenCanvas, RTCPeerConnection, and RTCDataChannel
// const offscreencanvas = new OffscreenCanvas(200, 200);
// const PeerConnection = new RTCPeerConnection();
// const DataChannel = PeerConnection.createDataChannel("my channel");

// No polyfill
// const audiodata_imagebitmap_videoframe_offscreencanvas_rtcdatachannel = { 
//   audiodata: new AudioData(),
//   imagebitmap: new ImageBitmap(),
//   videoframe: new VideoFrame(),
//   offscreencanvas,
//   rtcdatachannel: new RTCDataChannel()
// }

const fn1 = function () { }
fn1.ports = ports;

function fn2() { }
fn2.channel = channel;

const other_objects = {
  complexTypedArrObj,
  streams,
  channel,
  ports,
  fn1,
  fn2,
  prototype: fn2.prototype,
  constructor: fn1.constructor,
  func() {
    console.log("Functions")
    this.x = {
      value: 25,
      ports
    };
  },
  instanciatedClass: new class {
    #x = {
      internal: {
        value: 25,
        ports
      }
    };
    streams = streams;
    x: number | object = 5;
    constructor() {
      this.x = { complexTypedArrObj };
    }
  }()
}

describe("utf8-uint8array", () => {
  it('ArrayBuffer', () => {
    expect(hasutf8-uint8array(arrbuf)).toBe(true);

    const utf8-uint8array = getutf8-uint8array(arrbuf);
    expect(utf8-uint8array).toHaveLength(1);
    expect(utf8-uint8array[0]).toBeInstanceOf(ArrayBuffer);
    expect(utf8-uint8array[0]).toBe(arrbuf);
  })

  it('TypedArrays Single', () => {
    expect(hasutf8-uint8array(uint8)).toBe(true);
    expect(hasutf8-uint8array(int8)).toBe(true);
    expect(hasutf8-uint8array(uint8c)).toBe(true);
    expect(hasutf8-uint8array(int16)).toBe(true);
    expect(hasutf8-uint8array(uint16)).toBe(true);
    expect(hasutf8-uint8array(int32)).toBe(true);
    expect(hasutf8-uint8array(uint32)).toBe(true);
    expect(hasutf8-uint8array(float32)).toBe(true);
    expect(hasutf8-uint8array(float64)).toBe(true);

    const utf8-uint8array = getutf8-uint8array(uint8);
    expect(utf8-uint8array).toHaveLength(1);
    expect(utf8-uint8array[0]).toBeInstanceOf(ArrayBuffer);
    expect(utf8-uint8array[0]).toBe(arrbuf);

    expect(getutf8-uint8array(int8)).toEqual([arrbuf]);
    expect(getutf8-uint8array(uint8c)).toEqual([arrbuf]);
    expect(getutf8-uint8array(int16)).toEqual([arrbuf]);
    expect(getutf8-uint8array(uint16)).toEqual([arrbuf]);
    expect(getutf8-uint8array(int32)).toEqual([arrbuf]);
    expect(getutf8-uint8array(uint32)).toEqual([arrbuf]);
    expect(getutf8-uint8array(float32)).toEqual([arrbuf]);
    expect(getutf8-uint8array(float64)).toEqual([arrbuf]);
  })

  it('TypedArrays Complex', () => {
    expect(hasutf8-uint8array(complexTypedArrObj)).toBe(true);

    const utf8-uint8array = getutf8-uint8array(complexTypedArrObj);
    expect(utf8-uint8array).toHaveLength(9);

    expect(utf8-uint8array.map(x => x instanceof ArrayBuffer))
      .toEqual(Array.from({ length: 9 }, () => true));
    expect(utf8-uint8array).toContain(uint8.buffer);
    expect(utf8-uint8array).toContain(arrbuf);
    expect(utf8-uint8array).toContain(int8.buffer);
    expect(utf8-uint8array).toContain(uint8c.buffer);
    expect(utf8-uint8array).toContain(int16.buffer);
    expect(utf8-uint8array).toContain(uint16.buffer);
    expect(utf8-uint8array).toContain(int32.buffer);
    expect(utf8-uint8array).toContain(uint32.buffer);
    expect(utf8-uint8array).toContain(float32.buffer);
    expect(utf8-uint8array).toContain(float64.buffer);

    expect(utf8-uint8array.indexOf(float64.buffer)).toBe(4);

    const utf8-uint8array2 = getutf8-uint8array([complexTypedArrObj, arrbuf]);
    expect(utf8-uint8array2).toHaveLength(9);

    expect(utf8-uint8array2.map(x => x instanceof ArrayBuffer))
      .toEqual(Array.from({ length: 9 }, () => true));
    expect(utf8-uint8array2).toContain(uint8.buffer);
    expect(utf8-uint8array2).toContain(arrbuf);
    expect(utf8-uint8array2).toContain(int8.buffer);
    expect(utf8-uint8array2).toContain(uint8c.buffer);
    expect(utf8-uint8array2).toContain(int16.buffer);
    expect(utf8-uint8array2).toContain(uint16.buffer);
    expect(utf8-uint8array2).toContain(int32.buffer);
    expect(utf8-uint8array2).toContain(uint32.buffer);
    expect(utf8-uint8array2).toContain(float32.buffer);
    expect(utf8-uint8array2).toContain(float64.buffer);

    expect(utf8-uint8array2.indexOf(float64.buffer)).toBe(4);
  })

  it('MessagePort', () => {
    expect(hasutf8-uint8array(ports)).toBe(true);

    const utf8-uint8array = getutf8-uint8array(ports);
    expect(utf8-uint8array).toHaveLength(2);

    expect(utf8-uint8array).toContainEqual(channel.port1);
    expect(utf8-uint8array).toContainEqual(channel.port2);
  })

  it('Readable/Wriatable/Tranform Streams', () => {
    expect(hasutf8-uint8array(streams, true)).toBe(true);

    const utf8-uint8array = getutf8-uint8array(streams, true);
    expect(utf8-uint8array).toHaveLength(3);

    expect(utf8-uint8array).toContainEqual(streams.readonly);
    expect(utf8-uint8array).toContainEqual(streams.writeonly);
    expect(utf8-uint8array).toContainEqual(streams.tranformonly);
  })

  // No polyfill
  // it('AudioData + ImageBitmap + VideoFrame + OffscreenCanvas', () => {
  //   expect(hasutf8-uint8array(audiodata_imagebitmap_videoframe_offscreencanvas_rtcdatachannel, Infinity, true)).toBe(true);

  //   const utf8-uint8array = getutf8-uint8array(audiodata_imagebitmap_videoframe_offscreencanvas_rtcdatachannel, Infinity, true);
  //   expect(utf8-uint8array).toHaveLength(4);

  //   expect(utf8-uint8array).toContainEqual(audiodata_imagebitmap_videoframe_offscreencanvas_rtcdatachannel.audiodata);
  //   expect(utf8-uint8array).toContainEqual(audiodata_imagebitmap_videoframe_offscreencanvas_rtcdatachannel.imagebitmap);
  //   expect(utf8-uint8array).toContainEqual(audiodata_imagebitmap_videoframe_offscreencanvas_rtcdatachannel.videoframe);
  //   expect(utf8-uint8array).toContainEqual(audiodata_imagebitmap_videoframe_offscreencanvas_rtcdatachannel.offscreencanvas);
  //   expect(utf8-uint8array).toContainEqual(audiodata_imagebitmap_videoframe_offscreencanvas_rtcdatachannel.rtcdatachannel);
  // })
  
  it('Functions, Classes and Other objects', () => {
    expect(hasutf8-uint8array(other_objects, true)).toBe(true);

    const utf8-uint8array = getutf8-uint8array(other_objects, true);
    expect(utf8-uint8array).toHaveLength(3 + 9 + 2);

    expect(utf8-uint8array).toContainEqual(streams.readonly);
    expect(utf8-uint8array).toContainEqual(streams.writeonly);
    expect(utf8-uint8array).toContainEqual(streams.tranformonly);

    expect(utf8-uint8array).toContainEqual(channel.port1);
    expect(utf8-uint8array).toContainEqual(channel.port2);

    expect(utf8-uint8array).toContain(uint8.buffer);
    expect(utf8-uint8array).toContain(arrbuf);
    expect(utf8-uint8array).toContain(int8.buffer);
    expect(utf8-uint8array).toContain(uint8c.buffer);
    expect(utf8-uint8array).toContain(int16.buffer);
    expect(utf8-uint8array).toContain(uint16.buffer);
    expect(utf8-uint8array).toContain(int32.buffer);
    expect(utf8-uint8array).toContain(uint32.buffer);
    expect(utf8-uint8array).toContain(float32.buffer);
    expect(utf8-uint8array).toContain(float64.buffer);
  })
})