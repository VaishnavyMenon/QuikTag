// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ProductAuthenticator {
    address owner;
    event IsAdded(bool done, string emitted);
    event NotAuthorised(bool isValidUser, string emitted);
    event InValidProduct(string emitted);
    event ProductDetails(
        string id,
        string brand,
        string model,
        address ownedBy,
    
        string[] scannedBy
    );

    struct product {
        string brand;
        string model;
     
        address ownedBy;
        bool exists;
        string[] scannedBy;
    }

    // A struct which helps create a new customer
    struct customer {
        string name;
        string phone;
        bool exists;
    }

    struct retailer {
        string name;
        string control;
        string location;
        bool exists;
    }

    mapping(string => product) products;
    mapping(address => customer) customers;
    mapping(address => retailer) retailers;

    constructor() {
        owner = msg.sender;
    }

    // Function to add a new product
    function addProduct(
        string memory _id,
        string memory _brand,
    
        string memory _model
    ) public {
        if(products[_id].exists){
            bool done = false;
            emit IsAdded(done, "Product cannot be added !");
        }
        else{
        if(retailers[msg.sender].exists)
        {
        product memory newProduct;
        newProduct.brand = _brand;
        newProduct.model = _model;
    
        newProduct.ownedBy = msg.sender;
        newProduct.exists = true;
        products[_id] = newProduct;
        bool done = true;
        emit IsAdded(done, "Product added");
        }
        else
        {
            bool done = false;
            emit IsAdded(done, "Product cannot be added !");
        }
    }
}
    // Function to fetch product details
    function getProduct(string memory _id) public {
        if (products[_id].exists) {
            if (retailers[msg.sender].exists) {
                products[_id].scannedBy.push((retailers[msg.sender].name));
                products[_id].scannedBy.push((":Retailer "));
                emit ProductDetails(
                    _id,
                    products[_id].brand,
                    products[_id].model,
                    products[_id].ownedBy,
                    products[_id].scannedBy
                    
                );
            }else if (customers[msg.sender].exists) {
                products[_id].scannedBy.push((customers[msg.sender].name));
                products[_id].scannedBy.push((":Customer "));
                emit ProductDetails(
                    _id,
                    products[_id].brand,
                    products[_id].model,
                    products[_id].ownedBy,
                    products[_id].scannedBy
                    
                );
            }
              else {
                bool isValidUser = false;
                emit NotAuthorised(isValidUser, "Unauthorsied Access");
            }
        } else {
            emit InValidProduct("Product Not Found");
        }
    }

    function addRetailer(string memory _name, string memory _location)
        public
        returns (string memory response)
    {
        response = "Already existing account.. !";
        if (retailers[msg.sender].exists != true && customers[msg.sender].exists != true) {
            retailer memory newRetailer;
            newRetailer.name = _name;
            newRetailer.location = _location;
            newRetailer.exists = true;
            retailers[msg.sender] = newRetailer;
            newRetailer.control="Retailer";
            response = "New Retailer Added";
            emit IsAdded(true, response);
            return response;
        }
        emit IsAdded(false, response);
        return response;
    }

    function addCustomer(string memory _name, string memory _phone)
        public
        returns (string memory response)
    {
        response = "Already existing account.. !";
        if (customers[msg.sender].exists != true && retailers[msg.sender].exists != true) {
            customer memory newCustomer;
            newCustomer.name = _name;
            newCustomer.phone = _phone;
            newCustomer.exists = true;
            customers[msg.sender] = newCustomer;
            response = "New Customer Added";
            emit IsAdded(true, response);
            return response;
        }
        emit IsAdded(false, response);
        return response;
    }

    function checkOwnership(string memory _id)
        public
        view
        returns (bool response)
    {
        response = false;
        if (products[_id].exists) {
            
                response = true;
                return response;
            
        }
        return response;
    }

    function getCustomerDetails()
        public
        view
        returns (string memory name, string memory phone)
    {
        if (customers[msg.sender].exists) {
            return (customers[msg.sender].name, customers[msg.sender].phone);
        }
        return ("", "");
    }

    function getRetailerDetails()
        public
        view
        returns (string memory name, string memory location)
    {
        if (retailers[msg.sender].exists) {
            return (retailers[msg.sender].name, retailers[msg.sender].location);
        }
        return ("", "");
    }

    function fetchUserDetails()public view returns (string memory userType)
        {
        if (owner == msg.sender) {
            return "Owner";
        }
        if (retailers[msg.sender].exists) {
            return "Retailer";
        }
        if (customers[msg.sender].exists) {
            return "Customer";
        }
        return "User Not Found";
    }
    // function fetchUserDetails() public view returns (address owne) {
    //     return owner;
    // }
}