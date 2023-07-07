const logined_token = localStorage.getItem("access")

async function CreateCounsel() {
    let title = document.querySelector('#title').value;
    let content = document.querySelector('#content').value;
    let tags = document.querySelector('#tags').value;
    let checked = $('#anonymous-checkbox').is(':checked');
    let tag = JSON.stringify ([tags])

    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("content", content);
    formdata.append("tags", tag);
    if (checked) {
        formdata.append("is_anonymous", 'True');

    } else {
        formdata.append("is_anonymous", 'False');

    }


    const response = await fetch(`${BACKEND_BASE_URL}/counsel/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "POST",
        body: formdata,
    });
    const response_json = await response.json();

    if (response.status == 200) {
        swal("고민 상담이 등록되었습니다.", '', 'success')
            .then((value) => {
                window.location.replace(`${FRONTEND_BASE_URL}/counsel_list.html`);
            });
        
    } else if (response.status == 400) {

        for (let key in response_json) {

            swal(`${response_json[key]}`,'','warning');
        }
    }
}