import passport from "passport"
import { Strategy } from "passport-local"
import bcrypt from 'bcrypt'


interface CallbackType {
    (error: any, user: any, message: any): void
}

const Authenticate = async (
    user: any,
    username: string,
    password: string,
    done: CallbackType
  ) => {
    user.findOne({ 
      where: { username },
    })
      .then(async (users: any): Promise<any> => {
        if (!users) {
          return done(undefined, false, {
            message: "ไม่พบผู้ใช้งานนี้ในระบบ",
          })
        }

        const passwordMatch = await bcrypt.compare(password, users.password);
        if (passwordMatch) {
          return done(undefined, { users }, null)
        } else {
          return done(undefined, false, {
            message: "รหัสผ่านไม่ถูกต้อง"
        });
        }
        
      })
      .catch((err: any) => {
        return done(err, false, {
          message: "Something went wrong, please try again.",
        })
      })
  }

const setUp = async (user: any) => {
    passport.use('local',
      new Strategy(
        {
          usernameField: "username",
          passwordField: "password",
        },
        function (username: string, password: string, done: CallbackType) {

          return Authenticate(user, username, password, done)
        }
      )
    )
}
  
export { setUp }