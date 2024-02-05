// import { bigNumberify } from "web3number";
const { bigNumberify } = require("web3number");

async function  main() {
    console.log(bigNumberify("123")); // 123
}

main()