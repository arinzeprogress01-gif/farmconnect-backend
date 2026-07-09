import { AppError } from "./app.error.js";

export class ConflictError extends AppError {

    constructor(message) {

        super(message, 409);

    }

}