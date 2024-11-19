document.addEventListener('DOMContentLoaded', () => {
    const openFormButton = document.getElementById('openFormButton');
    const popup = document.getElementById('popup');
    const feedbackForm = document.getElementById('feedbackForm');
    const messageDiv = document.getElementById('message');
    const formFields = ['name', 'email', 'phone', 'organization', 'message'];

    // Открыть попап
    openFormButton.addEventListener('click', () => {
        showPopup();
    });

    // Закрыть попап при нажатии Back
    window.addEventListener('popstate', () => {
        if (popup.classList.contains('active')) closePopup();
    });

    // Сохранение введенных данных
    formFields.forEach(field => {
        const input = document.getElementById(field);
        input.value = localStorage.getItem(field) || '';
        input.addEventListener('input', () => {
            localStorage.setItem(field, input.value);
        });
    });

    // Показать попап и обновить URL
    function showPopup() {
        popup.classList.add('active');
        history.pushState({ popup: true }, '', '#feedback');
    }

    // Закрыть попап и обновить URL
    function closePopup() {
        popup.classList.remove('active');
        history.pushState(null, '', window.location.pathname);
    }

    // Отправка данных
    feedbackForm.addEventListener('submit', async (e) => {
        //выключает перезагрузку
        e.preventDefault();
      
        const formData = new FormData(feedbackForm);
        try {
            const response = await fetch('https://formcarry.com/s/NlaO2PnPwmG', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData,
            });
        
            if (!response.ok) {
                const errorText = await response.text(); 
                console.error('Ошибка:', response.status, errorText);
                alert('Ошибка!');
            } else {
                const result = await response.json(); 
                //чистит хранилище в случае успеха
                feedbackForm.reset();
                formFields.forEach(field => localStorage.removeItem(field));
                closePopup();
                alert('Сообщение успешно отправлено!');
            }
        } catch (error) {
            alert('Ошибка!');
        }
        
        
    });
});