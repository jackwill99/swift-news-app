import { Injectable } from "@nestjs/common";
import cluster from "cluster";
import * as process from "node:process";

const numCPUs = parseInt("1");

/**
 * [Ref](https://medium.com/deno-the-complete-reference/the-benefits-of-clustering-nestjs-app-in-node-js-hello-world-case-85ad53b61d90)
 */
@Injectable()
export class ClusterService {
  static clusterize(callback: Function): void {
    if (cluster.isPrimary) {
      console.log(`MASTER SERVER (${process.pid}) IS RUNNING `);

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
      });
    } else {
      callback();
    }
  }
}
