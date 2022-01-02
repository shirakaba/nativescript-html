export enum LogLevel {
    none,
    error,
    warn,
    info,
    debug,
    all,
}
/**
 * A minimal wrapper around a few console logging methods, supporting log levels.
 * You can replace the methods on a Logger instance by reassigning them.
 */
export class Logger {
    static shared = new Logger();
    logLevel: LogLevel = LogLevel.all;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: (...data: any[]) => void = (...data: any[]) => {
        if(this.logLevel < LogLevel.error){
            return;
        }
        console.error(data);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn: (...data: any[]) => void = (...data: any[]) => {
        if(this.logLevel < LogLevel.warn){
            return;
        }
        console.warn(data);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: (...data: any[]) => void = (...data: any[]) => {
        if(this.logLevel < LogLevel.info){
            return;
        }
        console.info(data);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug: (...data: any[]) => void = (...data: any[]) => {
        if(this.logLevel < LogLevel.debug){
            return;
        }
        console.debug(data);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trace: (...data: any[]) => void = (...data: any[]) => {
        if(this.logLevel < LogLevel.debug){
            return;
        }
        console.trace(data);
    }
}
export const logger = Logger.shared;