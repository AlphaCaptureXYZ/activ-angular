// @ts-ignore
import detectEthereumProvider from '@metamask/detect-provider';

let ethereum: any;

export function isNullOrUndefined(value: any) {
    const checkValue = [
        undefined,
        null,
        'undefined',
        'UNDEFINED',
        'Undefined',
        'null',
        'NULL',
        'Null',
        'NONE',
        'None',
        'none',
    ]?.includes(value)
        ? undefined
        : value;
    const check = checkValue === undefined || null ? true : false;
    return check;
}

export function wait(time = 1000): Promise<any> {
    return new Promise<void>((resolve, reject) => {
        try {
            const interval = setInterval(() => {
                clearInterval(interval);
                resolve();
            }, time);
        } catch (err) {
            reject();
        }
    });
}

export const getEthereum = async () => {
    try {
        if (isNullOrUndefined(ethereum) && (window as any)?.ethereum) {
            ethereum = await detectEthereumProvider();
        }
    } catch (err) {
        // console.log('getEthereum error', err.message);
    }
    return ethereum;
};
