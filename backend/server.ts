import Express from "express"
import session from "express-session"
import { join } from "path"
import { User } from "@prisma/client";
import { checkUser, createDoor, createUser, deleteDoor, deleteUser, editDoor, editUser, getDoorDetail, getDoors, getDoorsForUser, getDoorsForUserDetails, getUserDetail, getUsers, getUsersForDoor, toggleDoor } from "../DB/test";
const pagePath = "../frontend/"
const app = Express()
const port = 3000

type ResponseSucces = {
	success: true
	data: any
}
type ResponseError = {
	success: false
	reason: string
}

type Response = ResponseSucces | ResponseError

const logged: { [key: string]: User } = {

}

app.use(Express.json());       // to support JSON-encoded bodies
app.use(Express.urlencoded()); // to support URL-encoded bodies
app.use(Express.static(join(__dirname, '../frontend/dist/')))
app.use(
	session({
		secret: 'on s\'en fiche',
		resave: false,
		saveUninitialized: true
	})
)

function returnJSON(res:any, object:Response) {
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(object))
}

async function doAction(action: (data: any) => Promise<any|false>, data: any, minAuth: number, req:any, res:any) {
	const auth = checkAuth(req.session.id)
	if (auth >= minAuth) {
		let response = await action(data)
		if (response) {
			returnJSON(res, {success: true, data: response})
		} else {
			returnJSON(res, {success: false, reason: response})
		}
	} else {
		returnJSON(res, {success: false, reason: "Authorization unsufficient"})
	}
}

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

app.get("/", (req, res) => {
	return res.sendFile(join(__dirname, "../frontend/dist/index.html"))
})

app.post("/doors/", async (req, res) => {
	doAction(getDoorsForUser, logged[req.session.id], 0, req, res)
	// TODO: Remove if above is working
	// const auth = checkAuth(req.session.id)
	// if (auth > 0) {
	// 	const doors = await getDoorsForUser(logged[req.session.id])
	// 	returnJSON(res, {success: true, data: doors})
	// } else {
	// 	returnJSON(res, {success: false, reason: "You need to be logged in to see your doors"})
	// }
})

app.post("/users/", async (req, res) => {
	doAction(getUsers, {}, 1, req, res)
})

app.post("/door/edit/", async (req, res) => {
	doAction(editDoor, req.body, 1, req, res)
})
app.post("/door/delete/", async (req, res) => {
	doAction(deleteDoor, req.body.id, 1, req, res)
})

app.post("/door/create/", async (req, res) => {
	doAction(createDoor, req.body, 1, req, res)
})

app.post("/user/edit/", async (req, res) => {
	doAction(editUser, req.body, 1, req, res)
})

app.post("/user/delete/", async (req, res) => {
	doAction(deleteUser, req.body.id, 1, req, res)
})

app.post("/user/create/", async (req, res) => {
	doAction(createUser, req.body, 1, req, res)
})

app.post("/door/toggle/", async (req, res) => {
	const auth = checkAuth(req.session.id)
	if (auth >= 0) {
		if(req.body.id && req.body.closed !== undefined) {
			const response = await toggleDoor(req.body.id, req.body.closed, logged[req.session.id])
			if(response) {
				returnJSON(res, {
					success: true,
					data: {}
				})
			} else {
				returnJSON(res, {
					success: false,
					reason: "User doesn't have access to this door"
				})
			}
		} else {
			returnJSON(res, {
				success: false,
				reason: "not enough args"
			})
		}
	} else {
		returnJSON(res, {
			success: false,
			reason: "Not logged"
		})
	}
})

app.post("/user/get/", async (req, res) => {
	if(req.body.id) {
		const auth = checkAuth(req.session.id)
		if (auth > 0) {
			const details = await getUserDetail(req.body.id)
			if(details) {
				const doors = await getDoorsForUserDetails(details)
				if (doors) {
					// This shuffle is only here to let me add users to the object right after
					let toSend:any = details
					toSend.doors = doors;
					returnJSON(res, {success: true, data: toSend})
				} else {
					returnJSON(res, {success: true, data: details})
				}
			} else {
				returnJSON(res, {success: false, reason: "There was an error while retrieving the door"})
			}
		} else {
			returnJSON(res, {success: false, reason: "You should be an admin"})
		}
	} else {
		returnJSON(res, {success: false, reason: "You need to pass a door id"})
	}
})

app.post("/door/get/", async (req, res) => {
	if(req.body.id) {
		const auth = checkAuth(req.session.id)
		if (auth > 0) {
			const details = await getDoorDetail(logged[req.session.id], req.body.id)
			if(details) {
				const users = await getUsersForDoor(details)
				if (users) {
					// This shuffle is only here to let me add users to the object right after
					let toSend:any = details
					toSend.users = users;
					returnJSON(res, {success: true, data: toSend})
				} else {
					returnJSON(res, {success: true, data: details})
				}
			} else {
				returnJSON(res, {success: false, reason: "There was an error while retrieving the door"})
			}
		} else {
			returnJSON(res, {success: false, reason: "You should be an admin"})
		}
	} else {
		returnJSON(res, {success: false, reason: "You need to pass a door id"})
	}
})

app.post("/amiloggedin/", async (req, res) => {
	const auth = checkAuth(req.session.id)
	const data = {
		logged: true,
		admin: true
	}
	if(auth === 0) {
		data.admin = false
	} else if (auth === -1) {
		data.admin = false
		data.logged = false
	}
	returnJSON(res, {
		success: true,
		data
	})
})

app.post("/login/", async (req, res) => {
	if(req.body.username && req.body.password) {
		const result = await checkUser(req.body.username, req.body.password);
		if (result !== false) {
			logged[req.session.id] = result;
			returnJSON(res, { success: true , data: {}})
		} else {
			returnJSON(res, {success: false, reason: "Wrong credentials"})
		}
	} else {
		console.log("Got login post without required args");
	}
})

app.post("/logout/", (req, res) => {
	if(logged[req.session.id]) {
		delete logged[req.session.id]
		returnJSON(res, {success: true, data: {}})
	} else {
		returnJSON(res, {success: false, reason: "You aren't logged in"})
	}
});


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})