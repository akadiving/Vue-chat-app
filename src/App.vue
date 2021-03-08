<template>
  <v-app>
    <v-main >
      <!-- Login -->
      <v-container class="login" fill-height v-if="this.username === '' || this.username === null">
        <v-row class="justify-center" no-gutters align-content="center">
          <v-col align-self="center">
            <v-card color="white" height="40vh" class="rounded-lg" elevation="4">
              <br>
              <v-card-text class="display-1 font-weight-bold text--disabled">
                Join to AkoChat
              </v-card-text>
              <br>
              <v-text-field
                label="Username"
                placeholder="Please enter your name..."
                outlined
                clearable
                class='ma-1 rounded-lg'
                color="#0B7080"
                @submit.prevent="login()"
                v-on:keydown.13="login"
                v-model="inputUsername"
              >
              </v-text-field>
              <div class="ma-1" >
                <v-btn 
                elevation="8"
                block large 
                color="#041F38" 
                dark class="rounded-lg"
                @click="login()">
                  Join
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <!-- Login -->

      <!-- Chat -->
      <v-container v-else class="chat" fill-height fluid>
      <!-- Header with logout -->
        <v-app-bar
          fixed
          color="#041F38"
          class="rounded-0"
          elevation="0"
          dark
          >
            <v-toolbar-title>Welcome {{this.username}}</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-btn 
            color="#041F38"
            dark
            elevation="0"
            @click="logout()"
            >Leave<v-icon>mdi-exit-run</v-icon></v-btn>
        </v-app-bar>
      <!-- Header with logout -->
      
        <!-- Chat view -->
          <v-row>
            <v-card height="100vh" width="100vw" class="mb-6 pr-0 ma-0" elevation="0" >
              <br><br>
                <v-list v-for="(message, value) in messages" :key="value" 
                  rounded
                  dense class="pa-0 ma-0" >
                  <v-container v-if="message.username == username" fluid>
                    <v-row justify="start">
                      <v-subheader light class="font-weight-bold pa-2 mt-2">
                        {{message.username}}
                      </v-subheader>
                    </v-row>
                  </v-container>

                  <v-container v-else fluid>
                    <v-row justify="end">
                      <v-subheader light class="font-weight-bold pa-2 mt-2">
                        {{message.username}}
                      </v-subheader>
                    </v-row>
                  </v-container>

                    <v-list-item v-if="message.username == username">
                      <v-row justify="start" class="d-flex">
                        <v-card color="#041F38" class="rounded-xl d-flex ma-0" dark>
                          <div class="#041F38 darken-2 ma-1 pa-2">
                            <span class="white--text">{{message.text}}</span>
                          </div>
                        </v-card>
                      </v-row>
                    </v-list-item>

                    <v-list-item v-else>
                      <v-row justify="end">
                        <v-card color="#888" class="rounded-xl d-flex ma-0">
                          <div class="#888 darken-2 ma-1 pa-2">
                            <span class="white--text">{{message.text}}</span>
                          </div>
                        </v-card>
                      </v-row>
                    </v-list-item>
                </v-list>               
                <br><br><br><br>   
            </v-card>     
          </v-row>
        <!-- Chat view -->
        
        <!-- Send message view -->
        <v-footer fixed tile padless color="white">
          <v-row justify="center">
            <v-btn
              v-if="detectScroll"
              color="white"
              elevation="0"
              large
              fab
              @click="scrollDown()"
              ><v-icon color="#041F38">mdi-chevron-down-circle</v-icon></v-btn>
          </v-row>
          
          <v-col
            class="text-center"
            cols="12"
          >
            <v-text-field
              placeholder="Type here..."
              outlined
              clearable
              class='rounded-lg'
              color="#041F38"
              dense
              @submit.prevent="sendMessage()"
              v-model="inputMessage"
              v-on:keydown.13="sendMessage"
              type="text"
            >
              <v-icon 
                slot="append-outer" 
                color="#041F38"
                @click="sendMessage()">
                mdi-send
              </v-icon>
            </v-text-field>
          </v-col>
        </v-footer>
        <!-- Send message view -->

      </v-container>
      <!-- Chat -->
    </v-main>
  </v-app>
</template>

<script>
import db from './db'

export default {
  name: 'App',

  components: {
    
  },

  data: () => ({
    inputUsername: '',
    username: '',
    messages: [],
    inputMessage: '',
    detectScroll: false,
  }),

  methods: {
    login() {
      if (this.inputUsername != "" || this.inputUsername != null){
        this.username = this.inputUsername;
        this.inputUsername = ''
      }
    },
    logout(){
      this.username = '';
    },
    sendMessage(){
        const message ={
          text: this.inputMessage,
          username: this.username
        }

        if(this.inputMessage === "" || this.inputMessage === null){
            return;
        }
        db.database().ref("messages").push(message);
        this.inputMessage = '';
        this.scrollDown();
      },
    scrollDown() {
        window.scrollTo({
          top: document.body.scrollHeight,
          left: 0,
          behavior: 'smooth'
        });
      },
    // function to detect scroll up
    detect(){
      let nextScroll = window.pageYOffset + 400;
      let lastScroll = document.body.scrollHeight - nextScroll
      if (nextScroll < lastScroll){
        this.detectScroll = true;
      } else {
        this.detectScroll = false;
      }
      console.log(nextScroll)
      console.log(lastScroll)
    }
    },
  mounted(){
    const messages = db.database().ref("messages");

    messages.on('value', snapshot =>{
      const data = snapshot.val();
      let messages = [];
      
      Object.keys(data).forEach(key =>{
        messages.push({
          id: key,
          username: data[key].username,
          text: data[key].text
        })
      });
      this.messages = messages
    });
    this.scrollDown();
    window.addEventListener("scroll", this.detect)
  },
  
  destroyed (){
    window.removeEventListener("scroll", this.detect)
  }
};
</script>
<style>
.login {
  background-color: #041F38;
}
.chat{
  background-color: white;
}
.v-card-text{
  background-color: white;
}
.v-icon{
  cursor: pointer;
}

</style>