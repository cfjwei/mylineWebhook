function Find() {

    let sDate = $('input[name="from"]').val();
    let eDate = $('input[name="to"]').val();

    let sTime = new Date(sDate).getTime();
    let eTime = new Date(eDate).getTime();

    $.ajax({
        url: "/api/db/find",
        type: 'POST',
        dataType: "json",
        data: {
            target: 'lineChatlog',
            sTime: sTime,
            eTime: eTime
        },
        success: function (data) {
            console.log(data);
            this.generateTable(data.document);
        },
        error: function (e) {
            console.log(e)
        }
    });
}
function generateTable() {
    $('tbody').html(data.map(d => {
        return `<tr>
                <td>${d.userId}</td>
                <td>${d.sessionId}</td>
                <td>${d.userSay}</td>
                <td>${JSON.stringify(d.returnMessage)}/td>
                <td>${new Date(d.timestamp).toLocaleString()}</td>
            </tr>`
    }).join(''));
}