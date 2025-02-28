/* eslint-disable @typescript-eslint/no-var-requires */
import { IConfig } from 'config';
import config from 'config';

/**
 * Class that will be ConfigurationProvider
 * to represents a provider of a  configuration object.
 */
export abstract class ConfigurationProvider {
  /**
   * Method to be implemented
   * by the children classes to provided a configuration object.
   */
  abstract getConfig(): IConfig;

  /**
   * Return value for a specific config key/path provided
   * @param {string} path - The path to the config value
   * @returns {any} - The value of the config key
   */
  get<T>(path): T {
    return this.getConfig().get(path);
  }
}

/**
 * Class that provides a customizable config object
 */
export class ParametrizableConfigurationForTest extends ConfigurationProvider {
  config: IConfig;

  static fromCustomizableGetMethod(associationsOfInputsAndReturns): ConfigurationProvider {
    // No se esta usando un Map derecho sn construir el objecto por
    // si se quiere emular la funcionalidad de config config.util.getEnv.
    const config = {
      get: (configToObtaing) => {
        const associations = Object.entries(associationsOfInputsAndReturns);
        const map = new Map(associations);
        return map.get(configToObtaing);
      }
    };

    return new ParametrizableConfigurationForTest(config as IConfig);
  }

  constructor(config: IConfig) {
    super();
    this.config = config;
  }

  getConfig() {
    return this.config;
  }
}
/**
 * Class that provides a config object from the library.
 */
export class ConfigurationFromLib extends ConfigurationProvider {
  private configFromLib;

  static fromConfigLibrary() {
    return new ConfigurationFromLib(config);
  }

  constructor(config) {
    super();
    this.configFromLib = config;
  }

  getConfig() {
    return config;
  }

  override get<T>(configName): T {
    return this.configFromLib.get(configName);
  }
}
