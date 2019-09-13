<template>
    <div class="userBox">
        <div class="avatarBox">
            <img :src="this.$store.state.User.avatar" alt="显示不出来">
        </div>
        <div class="messageBox">
            <div class="message">
                <i class="el-icon-user-solid"></i>{{name}}<br><br>
                <i class="el-icon-user-solid"></i>{{identity}}
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            name:this.$store.state.User.name,
            identity:this.$store.state.User.identity
        }
    },
    // created () {
    //     if (this.$store.state.User.identity=="manager") {
    //         this.identity=="管理员";
    //     }else{
    //         this.identity=="员工";
    //     }
    // }
    
}
</script>

<style scoped>
.userBox{
    display: flex;
    height: 100%;
    
}
.avatarBox,.messageBox{
    height: 100%;
    
}
.avatarBox{
    width: 30%;
    background-color: brown;
     position: relative;
}
.messageBox{
    width: 70%;
    background-color:hotpink;
    position: relative;
}
img{
    border-radius: 50%;
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%)
}
.message{
    position: absolute;
    top: 40%;
}
</style>