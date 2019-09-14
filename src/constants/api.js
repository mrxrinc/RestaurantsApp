// APP wide Constants

export const DEBUG = true
export const Version = 2
// export const ContentType = 'application/json;charset=UTF-8'

export const URL = DEBUG ? 
  'https://chilivery.net/restaurant-mobile-api/v2/' : // DEVELOPMENT
  'https://chilivery.com/restaurant-mobile-api/v2/' // PRODUCTION

export const OTP_URL = DEBUG ?
  'https://chilivery.net/mobile-api/v2/' :
  'https://chilivery.com/mobile-api/v2/'

export const Auth = DEBUG ? 
  'Basic Y2hpbGlkZXY6d2VsY29tZXRvY2hpbGlkZXY=' : // DEVELOPMENT
  null // PRODUCTION

export const imageHeader = DEBUG ? 
  { Authorization: 'Basic Y2hpbGlkZXY6d2VsY29tZXRvY2hpbGlkZXY=' } : // DEVELOPMENT
  { Authorization: 'Basic yeeeehhhaaaaa_Cowboy:))))' } // PRODUCTION (no need actually)

export const INIT = {
  platform: 'ios',
  build: 1,
  device_id: '100',
  device: 'iPhone',
  c_version: 1
}

// NEUTRALIZE CONSOLE.LOG() (disabling console.log() for production)
if (!DEBUG) {
  console.log = () => {}
  console.info = () => {}
  console.debug = () => {}
}
