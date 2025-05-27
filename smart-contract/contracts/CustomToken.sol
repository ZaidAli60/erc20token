// SPDX-License-Identifier: MIT
pragma solidity 0.8.28; 

contract EmergingTechGridToken {
    // Token Details
    string private _name = "Emerging Tech Grid";
    string private  _symbol = "ETG";
    uint8 private  _decimals = 18;
    uint256 private  _totalSupply; 

    // Map storing balance in each address 
    mapping(address => uint256) private balances;   // Key is the address and value is the balance)

    // Mapping from addresses to allowances
    mapping (address => mapping (address => uint256)) private allowances; 

    // Events 
    event Transfer (address indexed from, address indexed to, uint256 value);
    event Approval  (address indexed owner, address indexed spender, uint256 value) ;

    
    // Constructor to mint initial supply 
    constructor(uint256 initialSupply ) {
        _totalSupply = initialSupply * 10 ** uint256(_decimals);
        balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    // Getter methods 

    function name() public view returns (string memory) {
        return _name;
    }    

    function symbol() public view returns (string memory) {
        return  _symbol;
    }

    function decimals() public view returns (uint8)  {
        return  _decimals;
    }

    function totalSupply() public view returns (uint256)    {
        return _totalSupply;
    }

    // Function to check the balance of an address 
    function balanceOf(address account) public view returns (uint256)   {
        return balances[account];
    }

    // Function to transfer token  

    function transfer(address recipient, uint256 amount) public returns(bool){  
        require(recipient != address(0), "Invalid address");
        require(balances[msg.sender] >= amount, "Insufficient balance");
         
        balances[msg.sender] -=amount;    // deducting token from the sender's account balance (after checking for allowance)    
        balances[recipient] += amount ;   // adding tokens to the recipient's account balance     
        emit Transfer(msg.sender, recipient , amount ); 
         return true;    
    }

    // Function to approve another contract address to spend tokens on your behalf)
    function approve(address spender, uint256 amount) public returns (bool){
        require(spender != address(0), "Approve to zero address");
        allowances[msg.sender][spender] = amount;   // approve the spend token on behalf of spender    
        emit Approval ( msg.sender, spender ,amount);
        return true;
    }

    // Function to check the amount of tokens that owner allowed to a spender 

    function allowance(address owner, address spender ) public view returns(uint256){
        return allowances[owner][spender];
    }

    // Function to transfer tokens on behalf of an address 
    function transferFrom(address sender, address recipient, uint256 amount)   public returns (bool){
       require (sender != address(0), "Invalid sender");
       require(recipient != address(0)   ) ;     // check if recipient is not a zero address
       require(balances[sender] >= amount, "Transfer amount exceeds balance");
       require(allowances[sender][msg.sender] >= amount,"Not enough allowance");  

        balances[sender] -=  amount;                /// deducting tokens from sender's account balance (after checking for allowance)   
        balances[recipient ] +=amount;   
        allowances[sender][msg.sender] -=amount ;       // updating the remaining allowance of spender for this token by decrementing its amount  
        emit Transfer ( sender , recipient, amount);     
        return true;          
         
     }

} 