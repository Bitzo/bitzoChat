/**
 * @Author: bitzo
 * @Date: 2017/7/5 18:47
 * @Last Modified by: bitzo
 * @Last Modified time: 2017/7/5 18:47
 * @Function:
 */

myApp.controller('userController', function($scope, $http, $location) {
    $scope.register = function (userinfo) {

        if(!userinfo || !userinfo.username){
            return $scope.errMsg = '请输入用户名！！';
        }
        if(!userinfo.password){
            return $scope.errMsg = '请输入密码！！';
        }
        if(!userinfo.Enpassword){
            return $scope.errMsg = '请确认密码！！';
        }
        if(userinfo.Enpassword != userinfo.password){
            return $scope.errMsg = '密码输入不一致！！';
        }

        $http({
            method: 'post',
            url: "/api/register",
            data:{
                username: userinfo.username,
                password: userinfo.password
            }
        }).then(function success(response) {
            if(response.data.isSuccess) {
                localStorage.setItem('token', response.data.token);
                location.href = './home';
            }else{
                alert(response.data.msg);
            }
            $scope.errMsg = '';
        }, function error(response) {
            alert(response.data.msg);
            $scope.errMsg = '';
        });
    };

    $scope.login = function (userinfo) {
        if(!userinfo || !userinfo.username){
            return $scope.errMsg = '请输入用户名！！';
        }
        if(!userinfo.password){
            return $scope.errMsg = '请输入密码！！';
        }

        $http({
            method: 'post',
            url: "/api/login",
            data:{
                username: userinfo.username,
                password: userinfo.password
            }
        }).then(function success(response) {
            if(response.data.isSuccess) {
                localStorage.setItem('token', response.data.token);
                location.href = './home';
            }else{
                alert(response.data.msg);
            }
            $scope.errMsg = '';
        }, function error(response) {
            alert(response.data.msg);
            $scope.errMsg = '';
        });
    };

    $scope.reset = function (data) {
        if(!data) return;

        for(let i in data) {
            data[i] = '';
        }
    }
});