import { setUp } from "../auth/passport/local";
import Users from "../model/users.model";
import passport from "passport"

passport.serializeUser((user: any, done: any): void => {
    done(null, user)
})
  
passport.deserializeUser((user: any, done: any): void => {
    done(null, user)
})

setUp(Users)

const authController = {
    signin: (args: any) => {
        return new Promise((resolve, reject) => {
            passport.authenticate("local", async(err: any, users: any, info: any) => {
              const error = err || info
              if (error) {
                return reject(error)
              }
              if (!users) {
                return reject("Something went wrong, please try again.")
              }
              resolve({
                  ...users.users.get()
              })
            })({ body: args })
        })
    },
}

export default authController