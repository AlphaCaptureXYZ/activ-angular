import { Injectable } from '@angular/core';

import IXilyACTIV from '@ixily/activ-web';

import { Router } from '@angular/router';

import { getEthereum, isNullOrUndefined, wait } from '../shared/shared';
import { WALLET_NETWORK_CHAIN_NAME } from '../shared/web3-helpers';

declare let Jimp: any;

@Injectable({
  providedIn: 'root',
})
export class ActivService {
  private ethereum: any;
  private activ: IXilyACTIV;

  private userWalletIsConnected: boolean;

  constructor(
    private router: Router
  ) {
    this.activ = null as any;
    this.ethereum = null;
    this.userWalletIsConnected = false;
  }

  getUtils() {
    return this.activ.getUtils();
  }

  async isWalletConnected() {
    let isConnected = false;
    try {
      this.ethereum = await getEthereum();
      const accounts = await this.ethereum?.request({
        method: 'eth_requestAccounts',
      });
      isConnected =
        accounts?.find((account: any) => account) || null ? true : false;
    } catch (err) {
      // console.error('ActivService isWalletConnected (error)', err.message);
    }
    return isConnected;
  }

  async init(config?: { reset?: boolean }) {
    try {
      await wait(500);

      this.ethereum = await getEthereum();

      let networkName: string = null as any;

      try {

        const accounts = await this.ethereum?.request({
          method: 'eth_requestAccounts',
        });

        this.userWalletIsConnected =
          accounts?.find((account: any) => account) || null ? true : false;
        networkName = await this.getNetworkName();

      } catch (err) {
        // console.error('ActivService userWalletIsConnected (error)', err.message);
      }

      const isPublic = isNullOrUndefined(this.ethereum) ? true : false;

      if (config?.reset) {
        this.activ = null as any;
      }

      if (isNullOrUndefined(this.activ)) {
        this.activ = new IXilyACTIV({
          webProvider: (window as any).ethereum,
          public: isPublic,
        });

        await this.networkCheck();

        await this.activ.init({
          Jimp,
          ipfsProxyEnabled: true,
          network: networkName as any,
          showLogsToDebug: true,
        });

        this.overrideSettings(true, this.ethereum);
      } else {
        this.overrideSettings(true, this.ethereum);
        await this.networkCheck();
      }
    } catch (err) {
      // console.error('ActivService (error)', err.message);
      this.overrideSettings(true, null);
    }
  }

  private overrideSettings(configured: boolean, provider: any) {
    try {
      this.activ?.overrideSettings({ configured, provider });
    } catch (err) {
      // console.error('ActivService [overrideSettings] (error)', err.message);
    }
  }

  async networkCheck() {
    const network = await this.getNetworkName();
    const getSupportedChainNetworks = await this.getSupportedChainNetworks();

    if (!getSupportedChainNetworks.includes(network as any)) {
      if (network !== '') {
        this.router.navigate(['/']);
      }
    }
  }

  async getNetworkName() {
    let chainNetworkName = '';

    try {
      this.ethereum = await getEthereum();
      if (this.ethereum) {
        const chainId: any = this.ethereum?.networkVersion || null;
        const chainNerworkId = Number(chainId);

        chainNetworkName =
          WALLET_NETWORK_CHAIN_NAME(chainNerworkId) || 'unknown';
      }
    } catch (err) {
      // console.error('ActivService getNetworkName (error)', err.message);
    }

    return chainNetworkName;
  }

  async getSettings() {
    let settings = null;
    try {
      settings = await this.activ.getSettings();
    } catch (err) { }
    return settings;
  }

  async isPublic() {
    return this.activ.isPublic();
  }

  async getSupportedChainNetworks() {
    return this.activ.getSupportedChainNetworks();
  }

  async getAllIdeas(page = 1, limit = 10) {
    // change according to your needs "userWalletIsConnected"
    return this.userWalletIsConnected
      ? this.activ.getAllIdeas(page, limit)
      : this.activ.getAllIdeas(page, limit);
  }

}
