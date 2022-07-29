## user api

### login 登录

```
url: /user/login
method: post
body: { name: string, password: string }
return: { status: "success" | "failed", error: string, data?: name }
```

### register 注册

```
url: /user/register
method: post
body: { name: string, password: string }
return: { status: "success" | "failed", error: string }
```

### getuser 获取用户基本信息

```
url: /user/getuser
method: get
params: { name: string }
return: { status: "success" | "failed", error: string, data: { name, nickName, friends, strangers, avatar } }
```

### updateuser 更新用户基本信息

```
url: /user/updateuser
method: post
body: User
return: { status: "success" | "failed", error: string, data: User }
```

### addfriendrequest 添加好友请求

```
url: /user/addfriendrequest
method: post
body: { friend: string, me: Stranger }
return: { status: "success" | "failed", error: string } }
```

### permitfriend 同意添加好友

```
url: /user/permitfriend
method: post
body: { friend: string, me: string }
return: { status: "success" | "failed", error: string } }
```

### permitfriend 同意添加好友

```
url: /user/permitfriend
method: post
body: { friend: string, me: string }
return: { status: "success" | "failed", error: string } }
```

### uploadfile 上传文件

```
url: /user/uploadfile
method: post
body: FormData(filestream, user?, originFilename)
return: { status: "success" | "failed", error: string, data: newFilename, originFilename } }
```

### deletefriend 删除好友

```
url: /user/deletefriend
method: post
body: { friend: string, me: string }
return: { status: "success" | "failed", error: string } }
```
