import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Navigation from '../../components/Navigation';
import fetchData from '../../actions/userDataActions';
import { addTransaction } from '../../actions/transactionsActions';

const INITIAL_STATE = {
    name: '',
    amount: '',
    date: '',
    category: '-1',
    account: '-1',
    description: '',
    debitOrCredit: 'expense',
};

class TransactionsAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...INITIAL_STATE,
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.props.fetchData();
    }

    componentDidUpdate(prevProps) {
        // Redirect if successfully added
        if (prevProps.userData.isUpdatingTransaction && !prevProps.userData.hasFailed
            && !this.props.userData.isUpdatingTransaction && !this.props.userData.hasFailed) {
            this.props.history.push('/transactions');
        }
    }

    onSubmit(evt) {
        evt.preventDefault();

        const submitData = { ...this.state };

        _.each(submitData, (item, key) => {
            if (item === '' || item === '-1') delete submitData[key];
        });

        // Set debit or credit
        if (this.state.debitOrCredit === 'expense') {
            submitData.amount = parseFloat(-Math.abs(submitData.amount));
        } else {
            submitData.amount = parseFloat(Math.abs(submitData.amount));
        }
        submitData.date = new Date(submitData.date);


        delete submitData.debitOrCredit;

        this.props.addTransaction(submitData);
    }

    onChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value,
        });
    }

    render() {
        return (
            <div>
                <Navigation />
                <h1>Add Transaction</h1>

                <form onSubmit={this.onSubmit}>

                    <input
                        type="radio"
                        name="debitOrCredit"
                        value="income"
                        checked={this.state.debitOrCredit === 'income'}
                        onChange={this.onChange}
                    />
                    Income

                    <input
                        type="radio"
                        name="debitOrCredit"
                        value="expense"
                        checked={this.state.debitOrCredit === 'expense'}
                        onChange={this.onChange}
                    />
                    Expense


                    <input type="text" name="name" placeholder="Transaction Name" value={this.state.name} onChange={this.onChange} />

                    <input type="text" name="amount" placeholder="Amount" value={this.state.amount} onChange={this.onChange} />

                    <select name="category" value={this.state.category} onChange={this.onChange}>
                        <option value="-1">No Category</option>
                        {_.map(this.props.userData.categories, (category, key) => <option key={key} value={key}>{category.name}</option>)}
                    </select>

                    <select name="account" value={this.state.account} onChange={this.onChange}>
                        <option value="-1">No Account</option>
                        {_.map(this.props.userData.accounts, (account, key) => <option key={key} value={key}>{account.name}</option>)}
                    </select>

                    <input type="date" name="date" value={this.state.date} onChange={this.onChange} />

                    <textarea name="description" value={this.state.description} onChange={this.onChange} />

                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

TransactionsAdd.propTypes = {
    fetchData: PropTypes.func.isRequired,
    addTransaction: PropTypes.func.isRequired,
    userData: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    userData: state.userData,
});

export default connect(mapStateToProps, {
    fetchData, addTransaction,
})(TransactionsAdd);