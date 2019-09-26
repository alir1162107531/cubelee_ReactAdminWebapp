

export default{

  isNull(value){
    return (value == null || (typeof (value) === 'string' && value === ''));
  }
  
}