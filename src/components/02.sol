// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}


// 需要先去0x20C0000000000000000000000000000000000001 合约中授权
contract TempoVault {
    // 你指定的 Tempo 链上代币地址
    address public constant DEPOSIT_TOKEN = 0x20C0000000000000000000000000000000000001;

    // 记录每个地址存了多少钱
    mapping(address => uint256) public userBalances;
    // 合约总存款
    uint256 public totalPool;

    event Deposited(address indexed user, uint256 amount, bytes32 invoiceId);
    event Withdrawn(address indexed user, uint256 amount, bytes32 invoiceId);

    /**
     * @dev 存款函数
     * @param amount 想要存入的代币数量
     */
    function deposit(uint256 amount, bytes32 invoiceId) external {
        require(amount > 0, "Amount must be greater than 0");

        // 1. 将代币从用户钱包转移到合约
        // 注意：调用此函数前，用户必须先在代币合约调用 approve(this_contract_address, amount)
        bool success = IERC20(DEPOSIT_TOKEN).transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer failed");

        // 2. 更新账本
        userBalances[msg.sender] += amount;
        totalPool += amount;

        emit Deposited(msg.sender, amount, invoiceId);
    }

    /**
     * @dev 提款函数
     * @param amount 想要提取的数量
     */
    function withdraw(uint256 amount, bytes32 invoiceId) external {
        require(userBalances[msg.sender] >= amount, "Insufficient balance");

        // 1. 更新账本（先更新再转账，防止重入攻击）
        userBalances[msg.sender] -= amount;
        totalPool -= amount;

        // 2. 将代币发回用户钱包
        bool success = IERC20(DEPOSIT_TOKEN).transfer(msg.sender, amount);
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, amount, invoiceId);
    }

    // 查看合约里当前的代币总额
    function getContractBalance() external view returns (uint256) {
        return IERC20(DEPOSIT_TOKEN).balanceOf(address(this));
    }
}