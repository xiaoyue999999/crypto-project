// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// 扩展后的 TIP20 接口
interface ITIP20 is IERC20 {
    function transferWithMemo(address to, uint256 amount, bytes32 memo) external;
}

// 需要先给合约转钱 然后使用合约进行批量转账
contract PaymentSender is Ownable {
    using SafeERC20 for IERC20;

    ITIP20 public token;

    // 事件：对前端监控和对账极其重要
    event PaymentSent(
        address indexed recipient,
        uint256 amount,
        bytes32 indexed invoiceId
    );

    event BatchPaymentSent(uint256 totalAmount, uint256 recipientCount);

    constructor(address _tokenAddress) Ownable(msg.sender) {
        token = ITIP20(_tokenAddress);
    }


    // 1. 带备注的单笔发送（优化版）
    function sendPaymentWithMemo(
        address recipient, 
        uint256 amount, 
        bytes32 invoiceId
    ) external onlyOwner {
        require(token.balanceOf(address(this)) >= amount, "Insufficient contract balance");
        
        // 调用 Tempo 特有的 transferWithMemo
        token.transferWithMemo(recipient, amount, invoiceId);
        
        emit PaymentSent(recipient, amount, invoiceId);
    }

    // 2. 批量支付：前端传入地址数组和金额数组
    // 适合工资发放、空投或返佣场景
    function batchSendPayments(
        address[] calldata recipients,
        uint256[] calldata amounts,
        bytes32[] calldata memos
    ) external onlyOwner {
        require(recipients.length == amounts.length && amounts.length == memos.length, "Array length mismatch");
        
        uint256 totalAmount = 0;
        for (uint i = 0; i < recipients.length; i++) {
            token.transferWithMemo(recipients[i], amounts[i], memos[i]);
            emit PaymentSent(recipients[i], amounts[i], memos[i]);
            totalAmount += amounts[i];
        }
        
        emit BatchPaymentSent(totalAmount, recipients.length);
    }

    // 3. 容错机制：紧急提取合约中的任意 TIP20 代币
    // 防止用户误充值，或为了清理合约余额
    function rescueTokens(address _token, address to, uint256 amount) external onlyOwner {
        IERC20(_token).safeTransfer(to, amount);
    }

    // 查看余额
    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
}