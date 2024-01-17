import Express from "express"
import session from "express-session"
import { join } from "path"
import { User } from "@prisma/client";
import { checkUser, getDoors } from "../DB/test";

const pagePath = "../frontend/"
const app = Express()
const port = 3000

function checkAuth(id: string): number {
	if (!logged[id]) {
		return -1
	}
	const user: User = logged[id]
	if (user.isadmin) {
		return 1
	}
	return 0
}

const logged: { [key: string]: User } = {

}

app.use(Express.static('../frontend/dist'))

app.use(
	session({
		secret: 'on s\'en fiche',
		resave: false,
		saveUninitialized: true,
	})
)




app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})