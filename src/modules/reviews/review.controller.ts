// import BaseController from "@/utils/base-controller.util";
// import { Router } from "express";

// export default class UserController implements BaseController {
//   path: string = "/reviews";
//   router: Router = Router();

//   constructor() {
//     this.initRoutes();
//   }

//   private initRoutes = (): void => {
//     this.router
//       .route(`${this.path}`)
//       .get(protect, authorize("admin"), this.getUsers)
//       .post(protect, authorize("admin"), this.createUser);
//   };
// }
