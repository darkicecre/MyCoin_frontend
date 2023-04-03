import { Link } from 'react-router-dom';

// material-ui
import { Box, Grid, OutlinedInput, Stack, Typography } from '@mui/material';

// project import
import useAuth from 'hooks/useAuth';
import AuthWrapper from 'sections/auth/AuthWrapper';
import FirebaseRegister from 'sections/auth/auth-forms/AuthRegister';
import { Button } from '@mui/material';
import { useState } from 'react';
import { InputAdornment } from '@mui/material';
import { IconButton } from '@mui/material';
import { EyeInvisibleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from '@mui/material';

// ================================|| REGISTER ||================================ //

const Register = () => {
  const { isLoggedIn } = useAuth();
  const [step,setStep] = useState(1);
  const [password,setPassword] = useState('');
  const [cases,setCase] = useState(0);
  const bruteForceTime = function(pass:any, characterSet:any, maxPasswordLength:any, hashesPerSecond:any) {
    var passwordLength = pass.length;
    var possiblePasswords = 0;
    var i, j;
    // Tính số lượng mật khẩu có thể có với các thông số đã cho
    for (i = 1; i <= maxPasswordLength; i++) {
      possiblePasswords += Math.pow(characterSet, i);
    }
  
    // Tính số lượng hashes cần để tìm được mật khẩu
    var hashesNeeded = possiblePasswords;
  
    // Tính thời gian cần để tìm được mật khẩu
    var seconds = hashesNeeded / hashesPerSecond;
  
    // Trả về thời gian tính bằng giây, phút và giờ
    var res = {
      seconds: Math.floor(seconds),
      minutes: Math.floor(seconds / 60),
      hours: Math.floor(seconds / 3600),
      months: Math.floor(seconds/2592000),
      pass:0
    };
    if(res.months>0){
      res.pass = 5;
    }
    else if(res.hours>0){
      res.pass = 4;
    }
    else if(res.minutes>1){
      res.pass = 3
    }
    else if(res.minutes==1){
      res.pass = 2
    }
    else{
      res.pass = 1
    }
    if(res.pass!=cases){
      setCase(res.pass);
    }
      return res
  }

  const passCheck = function(){
    var checkType = {num:false,lower:false,upper:false, special:false}
    var count = 0;
    for(var i =0;i<password.length;i++){
      if(password[i]>='0'&&password[i]<='9'){
        if(!checkType.num){
          checkType.num=true
          count +=10;
        }
      }
      else if(password[i]>='a'&&password[i]<='z'){
        if(!checkType.lower){
          checkType.lower=true
          count +=26;
        }
      }
      else if(password[i]>='A'&&password[i]<='Z'){
        if(!checkType.upper){
          checkType.upper=true
          count +=26;
        }
      }
      else{
        if(!checkType.special){
          checkType.special=true
          count +=10;
        }
      }
    }
    var passCase = bruteForceTime(password,count,password.length,10000000)
    var process = 0;
    var title = '';
    var tooltip = '';
    var color = '';
    switch(passCase.pass){
      case 1: {process = 4;title='Very Week';tooltip='Your password would be cracked less than a second';color='#f4432c';break;}
      case 2: {process = 21;title='Week';tooltip='Your password would be cracked 1 second';color='#f4432c';break;}
      case 3: {process = 42;title='Medium';tooltip='Your password would be cracked '+passCase.minutes+' minutes';color='#ff6d00';break;}
      case 4: {process = 84;title='Strong';tooltip='Your password would be cracked '+ passCase.hours+' hours';color='#0069F0';break;}
      case 5: {process = 100;title='Very Strong';tooltip='Your password would be cracked ' +passCase.months+ ' months';color='#0069F0';break;}
    }
    const res =(<>
      <Box sx={{height:'2px', width:'100%', background: 'rgba(95,99,104,.1)', marginTop: '15px', marginBottom:'4px'}}>
        <Box sx={{width:process+'%',background:''+color,height:'2px'}}></Box>
      </Box>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
        <Typography color={color}>{title}</Typography>
        <Tooltip title={tooltip}>
          <InfoCircleOutlined />
        </Tooltip>
      </Stack>
    </>)
    return res;
  }

  return (
    <AuthWrapper>
      {step == 0 ? 
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3" color="#0069F0">MyCoin</Typography>
              <Typography
                component={Link}
                to={isLoggedIn ? '/auth/login' : '/login'}
                variant="body1"
                sx={{ textDecoration: 'none' }}
                color="primary"
              >
                Already have an wallet?
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
              <Typography> MyCoin is a wallet that gives you easy access to all things crypto and web3. </Typography>
              <Button variant="contained" sx={{height:'40px',width:'100%',borderRadius:'10px', marginTop:'15px'}} onClick={()=>{setStep(1);}}>Create a new wallet</Button>
          </Grid>
        </Grid>
      :
      step==1 ?
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h2">Pick a password</Typography>
          </Stack>
            <Typography variant="body1">This will be used to unclok your wallet</Typography>
        </Grid>
        <Grid item xs={12}>
          <OutlinedInput id="end-adornment-password" type="password" placeholder="Password" endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" edge="end" color="secondary">
                <EyeInvisibleOutlined />
              </IconButton>
            </InputAdornment>
          } sx={{width:'100%'}} value={password} onChange={(event)=>{
            setPassword(event.target.value); 
          }}/>
          {password.length>0?passCheck():undefined}
          {cases>2?
              <Button variant="contained" sx={{height:'40px',width:'100%',borderRadius:'10px', marginTop:'15px'}} onClick={()=>{setStep(2);}}>Next</Button> :
              <Button variant="contained" disabled sx={{height:'40px',width:'100%',borderRadius:'10px', marginTop:'15px',color:'#b9b9b9'}} onClick={()=>{setStep(1);}}>Next</Button>
            }
          <Typography variant="body1" sx={{marginTop:'15px'}}>Best passwords are long and contain letters, numbers and special characters</Typography>
        </Grid>
      </Grid>
      :
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h2">Confirm your password</Typography>
          </Stack>
            <Typography variant="body1">MyCoin is non-custodial. We cannot restore or reset your password for you. Make sure you remember it. </Typography>
        </Grid>
        <Grid item xs={12}>
          <OutlinedInput id="end-adornment-password" type="password" placeholder="Password" endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" edge="end" color="secondary">
                <EyeInvisibleOutlined />
              </IconButton>
            </InputAdornment>
          } sx={{width:'100%'}} value={password} onChange={(event)=>{
            setPassword(event.target.value); 
          }}/>
          <Button variant="contained" sx={{height:'40px',width:'100%',borderRadius:'10px', marginTop:'15px'}} onClick={()=>{setStep(2);}}>Next</Button> :
          <Button variant="contained" disabled sx={{height:'40px',width:'100%',borderRadius:'10px', marginTop:'15px',color:'#b9b9b9'}} onClick={()=>{setStep(1);}}>Next</Button>
        </Grid>
      </Grid>

      }
    </AuthWrapper>
  );
};

export default Register;
