import {Command} from "commander";

const args = new Command;
args.option("-p <port>", "port", 8080 )
args.option("-m <mode>", "mode", "prod")

args.parse()

export default args.opts()
