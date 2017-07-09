/**
 * @Author: bitzo
 * @Date: 2017/7/6 12:42
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/6 12:42
 * @Function:
 */
myApp.controller('homeController', function($scope, $http, $location, $interval, $timeout, $window) {
    $scope.notice = '';
    $scope.msg = '';
    /**
     * 获取好友信息
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


    $scope.logout = function () {
        localStorage.clear();
        location.href = '/login';
    };

    $scope.addFriend = function (chatInfo) {
        $http({
            method: 'post',
            url: "/api/friends/" + chatInfo.accountID,
            data: {
                token: localStorage.getItem('token')
            }
        }).then(function success(response) {
            if (response.data.isSuccess) {
                $scope.msg = response.data.msg;
                $("#myModal").modal('show');
                $scope.friendlist.push({
                    friendID: chatInfo.accountID,
                    FName: chatInfo.userName,
                    ID: response.data.data.insertId
                })
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
            } else {
                $scope.msg = response.data.msg;
                $("#myModal").modal('show');
            }
        });
        ws.send(JSON.stringify(response));
    };

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

    $scope.chatlogs = [];
    let chatLog = {
        id: '',
        name: '',
        isPerson: '',
        time: '',
        content: ''
    };

    // 打开一个WebSocket:
    var ws = new WebSocket('ws://115.159.201.83:3000?token=' + localStorage.getItem('token'));

    // 响应onmessage事件:
    ws.onmessage = function (msg) {
        // console.log(msg);
        let receive = JSON.parse(msg.data);
        if (receive.code === 'matchSuccess') {
            $interval.cancel($scope.time_updateNotice);
            let data = receive.data;
            $timeout(() => {
                $scope.chatInfo.matchStatus = 0;
                $scope.chatInfo.isFriend = false;
                $scope.chatInfo.accountID = data.accountID;
                $scope.chatInfo.userName = data.username;
                $scope.chatInfo.chatStatus = '在与 ' + data.username + ' 聊天中...';
                $scope.chatInfo.matchMsg = '重新匹配';
                $scope.chatInfo.sendMsg = false;
                $scope.msg = '匹配成功咯~ 开始聊天吧！~';
                $("#myModal").modal('show');
            }, 0);
        }

        if (receive.code === 'matchFail') {
            $interval.cancel($scope.time_updateNotice);
            $timeout(() => {
                alert('服务器异常，请稍后再试')
                $scope.chatInfo.matchStatus = 0;
                $scope.chatInfo.isFriend = true;
                $scope.chatInfo.accountID = '';
                $scope.chatInfo.userName = '';
                $scope.chatInfo.sendMsg = true;
                $scope.chatInfo.matchMsg = '重新匹配';
            }, 0);
        }

        if (receive.code === 'chatEnd') {
            $timeout(() => {
                $scope.msg = '对方已结束聊天，重新匹配一个吧~';
                $("#myModal").modal('show');
                $scope.chatInfo.matchStatus = 0;
                $scope.chatInfo.isFriend = true;
                $scope.chatInfo.accountID = '';
                $scope.chatInfo.userName = '';
                $scope.chatInfo.sendMsg = true;
                $scope.chatInfo.matchMsg = '重新匹配';
            }, 0);
        }

        if (receive.code = 'msg') {
            let data = receive.data;
            // console.log(data);
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
    };

    // 给服务器发送一个字符串:
    ws.addEventListener('open', function (event) {
        let response = {
            code: '',
            data: ''
        };

        $window.onunload = function (e) {
            response.code = 'endChat';
            ws.send(JSON.stringify(response));
        };

        $timeout(() => {
            response.code = 'init';
            ws.send(JSON.stringify(response));
        }, 0);

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

        $scope.sendMessage = function (msg) {
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

    ws.addEventListener('close', function (event) {
        alert('连接好像端咯，重新匹配把');
        $timeout(() => {
            $interval.cancel($scope.time_updateNotice);
            $scope.chatInfo.matchStatus = 0;
            $scope.chatInfo.isFriend = true;
            $scope.chatInfo.accountID = '';
            $scope.chatInfo.userName = '';
            $scope.chatInfo.chatStatus = '聊天窗口';
            $scope.chatInfo.sendMsg = true;
            $scope.chatInfo.matchMsg = '重新匹配';
        }, 0);
    });

    //PersonInfo

    $("#userAvatar").fileinput({
        language: 'zh',
        showBrowse: true,
        showPreview: true,
        showRemove: true,
        showCancel: true,
        resizeImage: true,
        showUploadedThumbs: false,
        allowedFileExtensions: ['jpg', 'png'],
        uploadUrl: '',
        maxFileCount: 1,
    });

    $scope.showPersonInfo = function () {
        $("#personInfoEdit").modal('show');
    }
});