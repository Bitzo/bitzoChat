/**
 * @Author: bitzo
 * @Date: 2017/7/6 12:42
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/6 12:42
 * @Function:
 */
myApp.controller('homeController', function($scope, $http, $location, $interval, $timeout, $window, $route) {
    $scope.notice = '';
    $scope.msg = '';

    /**
     * 获取好友信息列表
     */
    $scope.friendlist = [];
    $http({
        method: 'get',
        url: "/api/friends",
        params: {
            token: localStorage.getItem('token')
        }
    }).then(function success(response) {
        if (response.data.isSuccess) {
            $scope.friendlist = response.data.data;
            if ($scope.friendlist.length === 0) {
                $scope.notice = '您暂时没有好友！赶紧去聊天添加好友吧！';
            }
        } else {
            $scope.friendlist = [];
            $scope.notice = '您暂时没有好友！赶紧去聊天添加好友吧！';
        }
    }, function error(response) {
        if (response.data.code == 401) {
            alert("请退出重新登录！")
            location.href = '/login';
        }
        $scope.notice = '您暂时没有好友！赶紧去聊天添加好友吧！';
    });

    /**
     * 获取个人信息
     */
    $scope.personInfo = [];
    $http({
        method: 'get',
        url: "/api/users/person",
        params: {
            token: localStorage.getItem('token')
        }
    }).then(function success(response) {
        if (response.data.isSuccess) {
            $scope.personInfo = response.data.data;
        }
    }, function error(response) {
        if (response.data.code == 401) {
            alert("请退出重新登录！")
            location.href = '/login';
        }
    });

    //登出
    $scope.logout = function () {
        localStorage.clear();
        location.href = '/login';
    };

    /**
     * 添加好友
     * @param info 对方的信息
     */
    function addFriend(info) {
        $http({
            method: 'post',
            url: "/api/friends/" + info.accountID,
            data: {
                token: localStorage.getItem('token')
            }
        }).then(function success(response) {
            if (response.data.isSuccess) {
                $scope.msg = response.data.msg;
                $("#myModal").modal('show');
                $scope.friendlist.push({
                    friendID: info.accountID,
                    FName: info.username,
                    ID: response.data.data.insertId,
                    avatar: info.avatar
                });

                $timeout(() => {
                    $scope.chatInfo.isFriend = true;
                }, 0);
            } else {
                $scope.msg = response.data.msg;
                $("#myModal").modal('show');
            }
        }, function error(response) {
            // alert(response.data.msg);
            if (response.data.code == 401) {
                alert("请退出重新登录！")
                location.href = '/login';
            } else {
                $scope.msg = response.data.msg;
                $("#myModal").modal('show');
            }
        });
    }

    //删除好友
    $scope.deleteFriend = function (index, fid) {
        let mymessage = confirm("是否确认删除好友：" + $scope.friendlist[index].FName);

        $scope.msg = '';

        if (mymessage) {
            $http({
                method: 'delete',
                url: "/api/friends/" + fid,
                params: {
                    token: localStorage.getItem('token')
                }
            }).then(function success(response) {
                if (response.data.isSuccess) {
                    $scope.friendlist.splice(index, 1);
                    if ($scope.friendlist.length === 0) $scope.notice = '您暂时没有好友！赶紧去聊天添加好友吧！';
                    // alert(response.data.msg);
                    $scope.msg = response.data.msg;
                    $("#myModal").modal('show');
                } else {
                    // alert(response.data.msg);
                    $scope.msg = response.data.msg;
                    $("#myModal").modal('show');
                }
            }, function error(response) {
                // alert(response.data.msg);
                if (response.data.code == 401) {
                    alert("请退出重新登录！")
                    location.href = '/login';
                }
                $scope.msg = response.data.msg;
                $("#myModal").modal('show');
            });
        }
    };

    /**
     * CHAT
     */
    $scope.chatInfo = {
        chatStatus: '聊天窗口',
        sendMsg: true,
        userName: '',
        accountID: '',
        avatar: '/images/avatar/default.png',
        isFriend: true,
        matchStatus: 0, //0 可以匹配 1 禁用匹配
        matchMsg: "开始匹配",
    };

    //聊天记录
    $scope.chatlogs = [];

    // 打开一个WebSocket:
    // var ws = new WebSocket('ws://115.159.201.83:3000?token=' + localStorage.getItem('token'));
    // var ws = new WebSocket('ws://192.168.0.106:3000?token=' + localStorage.getItem('token'));
    // var ws = new WebSocket('ws://192.168.199.105:3000?token=' + localStorage.getItem('token'));
    var ws = new WebSocket('ws://localhost:3000?token=' + localStorage.getItem('token'));

    // 响应onmessage事件:
    ws.onmessage = function (msg) {
        console.log(msg);

        //解析收到的消息
        let receive = JSON.parse(msg.data);

        //消息异常情况，请求重新登录获取最新的token
        if (receive.code === 'reLogin') {
            alert('登录失效，请重新登录！');
            location.href = './login';
        }

        //获取到聊天对象的好友状态
        if (receive.code === 'friendStatus') {
            let data = receive.data;
            $timeout(() => {
                $scope.chatInfo.isFriend = data.isFriend;
            }, 0);
        }

        //获取到聊天对象的头像信息
        if (receive.code === 'chatAvatar') {
            $timeout(() => {
                $scope.chatInfo.avatar = receive.data.avatar;
            }, 0);
        }

        //匹配聊天成功
        if (receive.code === 'matchSuccess') {
            $interval.cancel($scope.time_updateNotice);
            let data = receive.data;
            $timeout(() => {
                $scope.chatInfo.matchStatus = 0;
                $scope.chatInfo.isFriend = false;
                $scope.chatInfo.avatar = '/images/avatar/' + data.accountID + '.png';
                $scope.chatInfo.accountID = data.accountID;
                $scope.chatInfo.userName = data.username;
                $scope.chatInfo.chatStatus = '在与 ' + data.username + ' 聊天中...';
                $scope.chatInfo.matchMsg = '重新匹配';
                $scope.chatInfo.sendMsg = false;
                $scope.msg = '匹配成功咯~ 开始聊天吧！~';
                $("#myModal").modal('show');
            }, 0);
        }

        //匹配聊天失败，这里主要是服务器的异常，非匹配超时
        if (receive.code === 'matchFail') {
            $interval.cancel($scope.time_updateNotice);
            $timeout(() => {
                alert('服务器异常，请稍后再试')
                $scope.chatInfo.matchStatus = 0;
                $scope.chatInfo.isFriend = true;
                $scope.chatInfo.avatar = '/images/avatar/default.png';
                $scope.chatInfo.accountID = '';
                $scope.chatInfo.userName = '';
                $scope.chatInfo.sendMsg = true;
                $scope.chatInfo.matchMsg = '重新匹配';
            }, 0);
        }

        //聊天关闭
        if (receive.code === 'chatEnd') {
            $timeout(() => {
                $scope.msg = '对方已结束聊天，重新匹配一个吧~';
                $("#myModal").modal('show');
                $scope.chatInfo.matchStatus = 0;
                $scope.chatInfo.isFriend = true;
                $scope.chatInfo.accountID = '';
                $scope.chatInfo.avatar = '/images/avatar/default.png';
                $scope.chatInfo.userName = '';
                $scope.chatInfo.sendMsg = true;
                $scope.chatInfo.matchMsg = '重新匹配';
            }, 0);
        }

        //收到聊天对象发来的新消息
        if (receive.code === 'msg') {
            let data = receive.data;
            $timeout(() => {
                let chatlog = {
                    id: Math.random() * 100,
                    name: data.fName,
                    isPerson: data.isPerson,
                    time: data.time,
                    content: data.msg
                };
                $scope.chatlogs.push(chatlog);
            }, 100);
            $timeout(() => {
                $('#chatlog').scrollTop($('#chatlog')[0].scrollHeight);
            }, 200);
        }

        //收到好友请求
        if(receive.code === 'addFriendRequest') {
            let msg = confirm('用户：【' + receive.data.username + '】想要添加您为好友，是否同意？')

            if(msg){
                let response = {
                    code: '',
                    data: ''
                };

                response.code = 'addFriendCheck';
                response.data = {
                    isSuccess: true,
                    accountID: receive.data.accountID
                };
                console.log('sendMSG=====================')
                ws.send(JSON.stringify(response));
                addFriend(receive.data);
            }else{
                let response = {
                    code: '',
                    data: ''
                };

               response.code = 'addFriendCheck';
               response.data = {
                   isSuccess: false,
                   accountID: receive.data.accountID
               };
               return ws.send(JSON.stringify(response));
            }
        }

        //收到好友请求的回复
        if(receive.code === 'addFriendCheck') {
            if(receive.data.isSuccess) {
                alert('用户【' + receive.data.username + '】接受了你的好友请求！');
                addFriend(receive.data);
            }else{
                alert('用户【' + receive.data.username + '】拒绝了你的好友请求！');
            }
        }
    };

    // 给服务器发送一个字符串:
    ws.addEventListener('open', function (event) {
        // 发送消息模版
        let response = {
            code: '',
            data: ''
        };

        //页面刷新等情况下向服务器发送结束聊天的通知
        $window.onunload = function (e) {
            response.code = 'endChat';
            ws.send(JSON.stringify(response));
        };

        //ws开启时初始化个人状态
        $timeout(() => {
            response.code = 'init';
            ws.send(JSON.stringify(response));
        }, 0);

        //向服务器发送添加好友申请
        $scope.addFriend = function (chatInfo) {
            response.code = 'addFriend';
            response.data = chatInfo.accountID;
            ws.send(JSON.stringify(response));
            alert('好友申请已发出！');
        };

        //发送请求匹配聊天的消息
        $scope.startMatch = function () {
            $scope.chatlogs = [];
            response.code = 'addChat';

            ws.send(JSON.stringify(response));

            $scope.chatInfo.matchStatus = 1;
            $scope.chatInfo.isFriend = true;
            $scope.chatInfo.sendMsg = true;

            let time = 119;

            $scope.time_updateNotice = $interval(function () {
                $scope.chatInfo.matchMsg = '正在匹配（' + time + '）';
                --time;
            }, 1000);

            $timeout(() => {
                if ($scope.chatInfo.matchStatus === 1) {
                    $interval.cancel($scope.time_updateNotice);
                    $timeout(() => {
                        $scope.chatInfo.matchMsg = '匹配失败,重新匹配';
                        $scope.chatInfo.sendMsg = true;
                        $scope.chatInfo.matchStatus = 0;
                    }, 0);
                }
            }, 1000 * 120);
        };

        //向聊天对象发送消息
        $scope.sendMessage = function (msg) {
            if(!msg){
                return '';
            }

            let accountID = $scope.chatInfo.accountID,
                username = $scope.chatInfo.userName;
            response.code = 'sendMsg';
            response.data = {
                accountID: accountID,
                username: username,
                msg: msg
            };
            $scope.message = '';
            ws.send(JSON.stringify(response));
        }
    });

    //ws连接关闭
    ws.addEventListener('close', function (event) {
        alert('连接好像断咯，重新匹配把');
        location.href = './home';
        $timeout(() => {
            $interval.cancel($scope.time_updateNotice);
            $scope.chatInfo.matchStatus = 0;
            $scope.chatInfo.isFriend = true;
            $scope.chatInfo.accountID = '';
            $scope.chatInfo.avatar = '/images/avatar/default.png';
            $scope.chatInfo.userName = '';
            $scope.chatInfo.chatStatus = '聊天窗口';
            $scope.chatInfo.sendMsg = true;
            $scope.chatInfo.matchMsg = '重新匹配';
        }, 0);
    });

    //PersonInfo
    $("#userAvatar").fileinput({
        language: 'zh',
        uploadUrl: '/files/users/avatar',
        overwriteInitial: true,
        maxFileSize: 1500,
        showClose: false,
        showCaption: false,
        browseLabel: '',
        removeLabel: '',
        browseIcon: '<i class="glyphicon glyphicon-folder-open"></i>',
        removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
        removeTitle: 'Cancel or reset changes',
        elErrorContainer: '#kv-avatar-errors-1',
        msgErrorClass: 'alert alert-block alert-danger',
        defaultPreviewContent: '<img src="/images/avatar/default.png" alt="Your Avatar" style="width:160px">',
        layoutTemplates: {main2: '{preview} {remove} {browse}'},
        allowedFileExtensions: ["jpg", "png"],
        uploadExtraData: {
            token: localStorage.getItem('token')
        }
    });

    //查询展示个人信息
    $scope.showPersonInfo = function () {
        $http({
            method: 'get',
            url: "/api/users/person",
            params: {
                token: localStorage.getItem('token')
            }
        }).then(function success(response) {
            if (response.data.isSuccess) {
                $scope.personInfo = response.data.data;
                $scope.msg = '';
                $("#personInfoEdit").modal('show');
            } else {
                alert(response.data.msg);
            }
        }, function error(response) {
            if (response.data.code == 401) {
                alert("请退出重新登录！")
                location.href = '/login';
            }else{
                $scope.msg = response.data.msg || '拉取个人信息失败，请稍后再试！';
                $("#myModal").modal('show');
            }
        });
    };

    //修改个人信息
    $scope.updatePersonInfo = function (info) {
        if(info.password !== info.enPassword) {
            return $scope.msg = '密码不一致';
        }
        console.log(info)

        $http({
            method: 'put',
            url: "/api/users",
            data: {
                token: localStorage.getItem('token'),
                userInfo: info
            }
        }).then(function success(response) {
            if (response.data.isSuccess) {
                $scope.msg = response.data.msg || '更新失败，稍后再试';
            } else {
                $scope.msg = response.data.msg || '更新失败，稍后再试';
            }
        }, function error(response) {
            if (response.data.code == 401) {
                alert("请退出重新登录！")
                location.href = '/login';
            }else{
                $scope.msg = response.data.msg || '更新失败，稍后再试';
            }
        });
    }
});