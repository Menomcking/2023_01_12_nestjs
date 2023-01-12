import {
  Controller,
  Get,
  Render,
  Session,
  Post,
  Redirect,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import db from './db';
import * as bcrypt from "bcrypt";
import { UserDataDto } from './userdata.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index(@Session() session: Record<string, any>) {
    let userName = '';
    if(session.user_id){
      const [rows]: any = await db.execute(
        'SELECT username FROM users WHERE id = ?',
        [session.user_id],
      );
      userName = rows[0].username;
    }else{
      userName = 'Guest';
    }
    return {message: 'Welcome to the homepage, ' + userName};

  }
  @Get('/register')
  @Render('register')
  registerForm(){
    return{};
  }
  @Post('/register')
  @Redirect()
  async register(@Body() userdata: UserDataDto){
    db.execute('INSERT INTO users (username, password) VALES (?, ?)'),
    [userdata.username, await bcrypt.hash(userdata.password, 10)];
  }
  @Get('/login')
  @Render('login')
  loginForm(){
    return{};
  }
  @Post('/login')
  @Redirect()
  async login(@Body() userdata: UserDataDto, @Session() session: Record<string, any>) {
    let [rows]: any = await db.execute;
    await db.execute('SELECT id, username, passowrd FROM users WHERE username = ?',
    [userdata.username],
    );
    if(rows.length == 0){
      return {url:'/login'};
    }
    if(await bcrypt.compare(userdata.password, rows[0].passowrd)){
      session.user_id = rows[0].id;
      return { url: '/'}
    }
  }
}
