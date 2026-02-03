import { encode, decode } from 'zon-format';

export const encodeZon = (data) => {
    return encode(data);
}

export const decodeZon = (data) => {
    return decode(data);
}