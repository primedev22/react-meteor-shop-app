import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Image, ActivityIndicator } from 'react-native';
import { Button, Icon } from 'react-native-elements'
//REDUX
import { connect } from 'react-redux';
import * as actions from '../actions';
import { reduxForm, Field } from 'redux-form'
//COMPONENTS
import LoadingScreen from './LoadingScreen'
//MODULES
import { colorConfig, stylesConfig } from '../modules/config';
import apollo from '../ApolloClient.js';
import { loginWithPassword, userId } from 'meteor-apollo-accounts'

const { basicHeaderStyle, titleStyle } = stylesConfig;

const renderTextInput = ({ input, ...inputProps }) => {
  return (
    <TextInput
      style={styles.input} 
      onChangeText={input.onChange}
      {...inputProps}
    />
  );
}

const ErrorsArea = (errors) => {
  return (
    <View style={{textAlign: 'center'}}>
      {errors.map(item => <Text key={item}>{item}</Text>)}
    </View>
  );
}


class LoginForm extends React.Component {
  state = { loading: false, errors: [] }
 
  onSubmit = async () => {
    this.setState({loading: true, errors: []});

    if (!this.state.email) {
      let errors = this.state.errors;
      errors.push('please enter an email')
      return this.setState({errors: errors, loading: false});
    }

    if (!this.state.password) {
      let errors = this.state.errors;
      errors.push('please enter a password')
      return this.setState({errors: errors, loading: false});
    }
      
     try {
        const id = await loginWithPassword({ 
          email: this.state.email.trim().toLowerCase(), 
          password: this.state.password.trim().toLowerCase() 
        }, apollo)
        apollo.resetStore();
        this.setState({loading: false});
        return this.props.navigation.navigate('main');
    } catch (err) {
        //
        if (Platform.OS === 'android') {
          if(await userId()){
            apollo.resetStore();
            this.setState({loading: false});
            return this.props.navigation.navigate('main');
          }
          
        }
        let errors = err && err.graphQLErrors && err.graphQLErrors.length > 0 && err.graphQLErrors.map( err => err.message );
        this.setState({loading: false, errors: errors});
        return console.log('error ran')
    }


  }
  render(){
    const { handleSubmit, navigation } = this.props;

    if(this.state.loading) {
       return (
          <LoadingScreen loadingMessage={'Logging in...'} />
      );
    }

    return (
      <View style={styles.container}>
        {/*<Image style={{ width: 215, height: 45, marginBottom: 50}} 
            source={require('../assets/logo.png')} 
          />*/}
        <View style={{width: 250}}>
        <TextInput
          style={styles.input} 
          onChangeText={ (val) => this.setState({email: val}) }
          placeholder={'Email'}
        />
        <TextInput
          style={styles.input} 
          onChangeText={ (val) => this.setState({password: val}) }
          secureTextEntry
          placeholder={'Password'}
        />
        <Button 
          title='LOGIN'
          backgroundColor={colorConfig.business} 
          onPress={this.onSubmit} 
          style={{marginTop: 10}} 
        />

        <View style={{marginTop: 8, marginBottom: 8, alignItems: 'center',  justifyContent: 'center',}}>
          {this.state.errors.length > 0 && this.state.errors.map(item => {
            return <Text key={item} style={{color: '#e74c3c'}}>{item}</Text>
          })}
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('signup')}>
          <Text style={{marginTop: 25, color: '#fff', textAlign: 'center'}}>
            Or signup
          </Text>
        </TouchableOpacity>

      </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  labelStyle: {
    fontFamily: 'proximanovasoft-regular',
    color: '#666',
    textAlign: 'left',
    fontSize: 15,
  },
  buttonText: {
    fontFamily: 'proximanovasoft-bold',
    color: '#fff', 
    fontSize: 18,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderColor: 'transparent',
    backgroundColor: '#fff',
    opacity: 0.3,
    borderRadius: 3,
    marginBottom: 8,
    borderWidth: 1,
    padding: 3,
    height: 45,
    fontSize: 15,
    fontFamily: 'proximanovasoft-regular',
  }
})



export default LoginForm