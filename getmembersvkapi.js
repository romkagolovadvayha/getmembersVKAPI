VK.init({
    apiId: 654647 // ID вашего приложения VK
});

var Group = {};
Group.members = [];
Group.get = function (group_id, callback) {
    VK.Api.call('groups.getById', {group_id: group_id, fields: 'photo_50,members_count', v: '5.27'}, function (r) {
        if (!r.response) {
            return false;
        }
        callback(group_id, r.response);
    });
};
Group.getMembers = function (group_id, members_count, callback) {
    VK.Api.call("execute.getMembers", {}, function (data) {
        if (!data.response) {
            alert(data.error.error_msg); // в случае ошибки выведем её
            return false;
        }
        Group.members = Group.members.concat(JSON.parse("[" + data.response + "]")); // запишем это в массив
        callback(Group.members, members_count);

        if (members_count <= Group.members.length) {
            alert('Ура тест закончен! В массиве membersGroups теперь ' + Group.members.length + ' элементов.');
            return false;
        }
        // если еще не всех участников получили
        // задержка 0.333 с. после чего запустим еще раз
        setTimeout(function () {
            Group.getMembers(group_id, members_count);
        }, 333);
    });
};

Group.get(20629724, function (group_id, response) {
    document.getElementById('group_name').innerHTML = response[0].name;
    document.getElementById('members_count').innerHTML = response[0].members_count;
    // получем участников группы и пишем в массив membersGroups
    Group.getMembers(group_id, response[0].members_count, function (members, members_full_count) {
        document.getElementById('progress').innerHTML = 'Загрузка: ' + members.length + '/' + members_full_count;
    });
});