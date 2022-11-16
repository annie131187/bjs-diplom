"use strict";

const logout = new LogoutButton();
logout.action = () => {
    ApiConnector.logout(response => {
        if(response.success === true) {
           location.reload();
        }
    });
}

ApiConnector.current(response => {
    if (response.success === true) {
        ProfileWidget.showProfile(response.data);
    }
})

const rates = new RatesBoard();
function ratesRequest() {
    ApiConnector.getStocks(response => {
        if(response.success === true) {
            rates.clearTable();
            rates.fillTable(response.data);
        }
    });
}
ratesRequest();
setInterval(ratesRequest, 60000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = ({currency, amount}) => {
    ApiConnector.addMoney({currency, amount}, response => {
        if(response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, `Пополнение баланса на ${amount} ${currency} прошло успешно!`);
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}

moneyManager.conversionMoneyCallback = ({fromCurrency, targetCurrency, fromAmount}) => {
    ApiConnector.convertMoney({fromCurrency, targetCurrency, fromAmount}, response => {
        if(response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, `Конвертация прошла успешно!`);
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}

moneyManager.sendMoneyCallback = ({to, currency, amount}) => {
    ApiConnector.transferMoney({to, currency, amount}, response => {
        if(response.success === true) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(true, `Перевод выполнен успешно!`);
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}

const favorites = new FavoritesWidget();
ApiConnector.getFavorites(response => {
    if (response.success === true) {
        favorites.clearTable();
        favorites.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

favorites.addUserCallback = ({id, name}) => {
    ApiConnector.addUserToFavorites({id, name}, response => {
        if (response.success === true) {
            favorites.clearTable();
            favorites.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favorites.setMessage(true, `Успешное добавление пользователя ${name} в Избранное!`)
        } else {
            favorites.setMessage(false, response.error);
        }
    });
}

favorites.removeUserCallback = (id) => {
    ApiConnector.removeUserFromFavorites(id, response => {
        if (response.success === true) {
            favorites.clearTable();
            favorites.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favorites.setMessage(true, `Пользователь успешно удален из Избранного!`)
        } else {
            favorites.setMessage(false, response.error);
        }
    });
}