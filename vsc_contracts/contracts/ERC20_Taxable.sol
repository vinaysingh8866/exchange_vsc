// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract ERC20_taxable is ERC20, ERC20Permit {
    uint256 public taxRate;
    bool public isTaxable;
    address public taxRecipient;
    uint8 private decimals = 18;
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _taxRate,
        bool _isTaxable,
        address _taxRecipient,
        uint8 _decimals
    ) ERC20(name, symbol) ERC20Permit(name) {
        taxRate = _taxRate;
        isTaxable = _isTaxable;
        taxRecipient = _taxRecipient;
        decimals = _decimals;
        _mint(msg.sender, initialSupply * 10 ** _decimals);
    }

    function transfer(
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        uint256 tax = (amount * taxRate) / 10000;
        uint256 taxedAmount = amount - tax;
        _transfer(_msgSender(), recipient, taxedAmount);
        _burn(_msgSender(), tax);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        uint256 tax = (amount * taxRate) / 10000;
        uint256 taxedAmount = amount - tax;
        _transfer(sender, recipient, taxedAmount);
        _transfer(sender, taxRecipient, tax);
        uint256 currentAllowance = allowance(sender, _msgSender());
        require(
            currentAllowance >= amount,
            "ERC20: transfer amount exceeds allowance"
        );
        _approve(sender, _msgSender(), currentAllowance - amount);
        return true;
    }

    function burn(address account, uint256 amount) public {
        _burn(account, amount);
    }
}
