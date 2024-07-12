import request from '@/utils/request'

export function tts(data: any) {
  return request({
    url: '/api/moyin/tts',
    method: 'POST',
    data,
  })
}

export function getWords(word: any) {
  return request({
    url: '/moyin/tts/tnList',
    method: 'GET',
    data: { word },
  })
}

export function tnList(word: any) {
  return request({
    url: '/moyin/tts/tnList',
    method: 'GET',
    data: { word },
  })
}

export function downloadAudio(url: string) {
  return request({
    url: '/dev-api/moyin/tts/audition/' + url,
    method: 'GET',
  })
}

export function ttsRecordList(params: any) {
  return request({
    url: '/moyin/tts/ttsRecordList',
    method: 'GET',
    params,
  })
}

export function ttsRecordDelete(id: any) {
  return request({
    url: '/moyin/tts/ttsRecordDelete/' + id,
    method: 'DELETE',
  })
}
