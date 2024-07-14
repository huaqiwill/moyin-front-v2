import request from '@/utils/request'

export function tts(data: any) {
  return request({
    url: '/moyin/tts',
    method: 'post',
    data,
  })
}

export function getWords(word: any) {
  return request({
    url: '/moyin/tts/tnList',
    method: 'get',
    data: { word },
  })
}

export function tnList(word: any) {
  return request({
    url: '/moyin/tts/tnList',
    method: 'get',
    data: { word },
  })
}

export function downloadAudio(url: string) {
  return request({
    url: '/dev-api/moyin/tts/audition/' + url,
    method: 'get',
  })
}

export function ttsRecordList(params: any) {
  return request({
    url: '/moyin/tts/ttsRecordList',
    method: 'get',
    params,
  })
}

export function ttsRecordDelete(id: any) {
  return request({
    url: '/moyin/tts/ttsRecordDelete/' + id,
    method: 'delete',
  })
}
