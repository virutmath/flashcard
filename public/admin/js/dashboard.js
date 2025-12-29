const API_URL = '/api/admin';
let adminToken = localStorage.getItem('adminToken');
let adminRole = localStorage.getItem('adminRole');

// Redirect to login if not authenticated
if (!adminToken) {
    window.location.href = '/admin/login.html';
}

// Set admin info
function setAdminInfo() {
    const decoded = JSON.parse(atob(adminToken.split('.')[1]));
    document.getElementById('adminName').textContent = `Admin #${decoded.adminId}`;
    document.getElementById('adminRole').textContent = adminRole === 'admin' ? 'Admin' : 'Moderator';
    document.getElementById('adminRole').className = `role-badge role-${adminRole}`;
}

// Show/Hide pages
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageName).classList.remove('hidden');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    event.target.closest('.nav-link').classList.add('active');

    if (pageName === 'dashboard') loadDashboard();
    if (pageName === 'users') loadUsers();
    if (pageName === 'admin-users') loadAdminUsers();
    if (pageName === 'flashcards') loadFlashcards();
    if (pageName === 'topics') loadTopics();
    if (pageName === 'levels') loadLevels();
    if (pageName === 'badges') loadBadges();
}

// Dashboard
async function loadDashboard() {
    try {
        // Load statistics
        const usersRes = await fetch(`${API_URL}/users?page=1&pageSize=1`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const flashcardsRes = await fetch(`${API_URL}/flashcards?page=1&pageSize=1`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const topicsRes = await fetch(`${API_URL}/topics`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const badgesRes = await fetch(`${API_URL}/badges`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        const users = await usersRes.json();
        const flashcards = await flashcardsRes.json();
        const topics = await topicsRes.json();
        const badges = await badgesRes.json();

        document.getElementById('userCount').textContent = users.meta?.total || 0;
        document.getElementById('flashcardCount').textContent = flashcards.meta?.total || 0;
        document.getElementById('topicCount').textContent = topics.data?.length || 0;
        document.getElementById('badgeCount').textContent = badges.data?.length || 0;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Users
async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await response.json();

        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = '';
        data.data.forEach(user => {
            tbody.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editUser('${user.id}')">Sửa</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">Xóa</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function deleteUser(userId) {
    if (!confirm('Bạn chắc chắn muốn xóa user này?')) return;

    try {
        await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        loadUsers();
    } catch (error) {
        alert('Lỗi khi xóa user: ' + error.message);
    }
}

// Admin Users
async function loadAdminUsers() {
    if (adminRole !== 'admin') {
        document.querySelector('#admin-users .btn-primary').style.display = 'none';
    }

    try {
        const response = await fetch(`${API_URL}/admin-users`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await response.json();

        const tbody = document.querySelector('#adminUsersTable tbody');
        tbody.innerHTML = '';
        data.data.forEach(admin => {
            tbody.innerHTML += `
                <tr>
                    <td>${admin.id}</td>
                    <td>${admin.username}</td>
                    <td><span class="role-badge role-${admin.role}">${admin.role}</span></td>
                    <td>
                        ${adminRole === 'admin' ? `
                            <button class="btn btn-sm btn-warning" onclick="editAdmin('${admin.id}')">Sửa</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteAdmin('${admin.id}')">Xóa</button>
                        ` : ''}
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error loading admin users:', error);
    }
}

function showAddAdminForm() {
    const modal = new bootstrap.Modal(document.getElementById('formModal'));
    document.getElementById('formTitle').textContent = 'Thêm Admin User';
    document.getElementById('formBody').innerHTML = `
        <form id="adminForm">
            <div class="mb-3">
                <label class="form-label">Tên đăng nhập</label>
                <input type="text" class="form-control" id="adminUsername" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Mật khẩu</label>
                <input type="password" class="form-control" id="adminPassword" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Quyền</label>
                <select class="form-select" id="adminRole">
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Lưu</button>
        </form>
    `;

    document.getElementById('adminForm').onsubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_URL}/admin-users`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: document.getElementById('adminUsername').value,
                    password: document.getElementById('adminPassword').value,
                    role: document.getElementById('adminRole').value
                })
            });
            modal.hide();
            loadAdminUsers();
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    };

    modal.show();
}

async function deleteAdmin(adminId) {
    if (!confirm('Bạn chắc chắn muốn xóa admin này?')) return;

    try {
        await fetch(`${API_URL}/admin-users/${adminId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        loadAdminUsers();
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

// Flashcards (with pagination)
let flashcardsPage = 1;
let flashcardsPageSize = 20;

async function loadFlashcards(page = flashcardsPage) {
    flashcardsPage = page;
    try {
        const response = await fetch(`${API_URL}/flashcards?page=${flashcardsPage}&pageSize=${flashcardsPageSize}` , {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await response.json();

        const tbody = document.querySelector('#flashcardsTable tbody');
        tbody.innerHTML = '';
        data.data.forEach(fc => {
            const imageUrl = fc.content?.image_url || 'https://via.placeholder.com/60x60?text=No+Photo';
            const meaningEn = fc.content?.meanings?.en || '-';
            const meaningVi = fc.content?.meanings?.vi || '-';
            const audioCn = fc.content?.audio?.cn;
            tbody.innerHTML += `
                <tr>
                    <td><img src="${imageUrl}" alt="flashcard" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
                    <td>${fc.content.hanzi}</td>
                    <td>${fc.content.pinyin}</td>
                    <td>${audioCn ? `<audio controls preload="none" style="width: 140px;"><source src="${audioCn}" type="audio/mpeg">Audio</audio>` : '-'}</td>
                    <td>${meaningEn}</td>
                    <td>${meaningVi}</td>
                    <td>${fc.topic}</td>
                    <td>${fc.level}</td>
                    <td>${fc.is_premium ? 'Có' : 'Không'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editFlashcard('${fc.id}')">Sửa</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteFlashcard('${fc.id}')">Xóa</button>
                    </td>
                </tr>
            `;
        });

        // Render pagination controls
        const meta = data.meta || { page: flashcardsPage, totalPages: 1, total: data.data.length };
        renderFlashcardsPagination(meta);
    } catch (error) {
        console.error('Error loading flashcards:', error);
    }
}

function renderFlashcardsPagination(meta) {
    const container = document.getElementById('flashcardsPagination');
    if (!container) return;
    const { page, totalPages, total } = meta;
    const disablePrev = page <= 1 ? 'disabled' : '';
    const disableNext = page >= totalPages ? 'disabled' : '';

    container.innerHTML = `
        <div class="d-flex align-items-center justify-content-between">
            <div>
                <label class="form-label me-2 mb-0">Kích thước trang:</label>
                <select id="flashcardsPageSize" class="form-select form-select-sm d-inline-block" style="width: auto;">
                    ${[10,20,50,100].map(sz => `<option value="${sz}" ${sz===flashcardsPageSize?'selected':''}>${sz}</option>`).join('')}
                </select>
                <span class="ms-3">Tổng: ${total}</span>
            </div>
            <div class="btn-group">
                <button class="btn btn-outline-secondary btn-sm" ${disablePrev} onclick="loadFlashcards(${page-1})">« Trước</button>
                <span class="btn btn-outline-secondary btn-sm disabled">Trang ${page} / ${totalPages}</span>
                <button class="btn btn-outline-secondary btn-sm" ${disableNext} onclick="loadFlashcards(${page+1})">Sau »</button>
            </div>
        </div>
    `;

    const select = document.getElementById('flashcardsPageSize');
    if (select) {
        select.onchange = () => {
            flashcardsPageSize = parseInt(select.value, 10) || 20;
            loadFlashcards(1);
        };
    }
}

async function showAddFlashcardForm() {
    const modal = new bootstrap.Modal(document.getElementById('formModal'));

    // Fetch topics for dropdown
    let topics = [];
    try {
        const res = await fetch(`${API_URL}/topics`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await res.json();
        topics = data.data || [];
    } catch (err) {
        console.error('Error loading topics for form', err);
    }

    const topicOptions = [`<option value="0">Chưa phân loại</option>`]
        .concat(topics.map(t => `<option value="${t.id}">${t.label}</option>`))
        .join('');

    const levelOptions = [
        { id: 'hsk1', label: 'HSK 1' },
        { id: 'hsk2', label: 'HSK 2' },
        { id: 'hsk3', label: 'HSK 3' },
        { id: 'hsk4', label: 'HSK 4' },
        { id: 'hsk5', label: 'HSK 5' },
        { id: 'hsk6', label: 'HSK 6' }
    ].map(l => `<option value="${l.id}">${l.label}</option>`).join('');

    document.getElementById('formTitle').textContent = 'Thêm Flashcard';
    document.getElementById('formBody').innerHTML = `
        <form id="flashcardForm">
            <div class="mb-3">
                <label class="form-label">Hán tự</label>
                <input type="text" class="form-control" id="flashcardHanzi" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Pinyin</label>
                <input type="text" class="form-control" id="flashcardPinyin" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Nghĩa tiếng Anh</label>
                <input type="text" class="form-control" id="flashcardMeaningEn">
            </div>
            <div class="mb-3">
                <label class="form-label">Nghĩa tiếng Việt</label>
                <input type="text" class="form-control" id="flashcardMeaningVi">
            </div>
            <div class="mb-3">
                <label class="form-label">Ảnh minh họa</label>
                <input type="file" class="form-control" id="flashcardImage" accept="image/*">
                <small class="text-muted">Upload sẽ thực hiện phía server để bảo mật key</small>
            </div>
            <div class="mb-3">
                <label class="form-label">Audio tiếng Trung (tùy chọn)</label>
                <input type="file" class="form-control" id="flashcardAudio" accept="audio/*">
                <small class="text-muted">Nếu bỏ trống, hệ thống sẽ tự tạo audio bằng TTS.</small>
            </div>
            <div class="mb-3">
                <label class="form-label">Topic</label>
                <select class="form-select" id="flashcardTopicId">
                    ${topicOptions}
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Level</label>
                <select class="form-select" id="flashcardLevelId" required>
                    ${levelOptions}
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Premium</label>
                <select class="form-select" id="flashcardPremium">
                    <option value="0">Không</option>
                    <option value="1">Có</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary" id="submitFlashcard">Lưu</button>
        </form>
    `;
    modal.show();

    document.getElementById('flashcardForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submitFlashcard');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang xử lý...';

        try {
            const formData = new FormData();
            // Client không cần tạo ID, server sẽ tạo UUID
            formData.append('hanzi', document.getElementById('flashcardHanzi').value);
            formData.append('pinyin', document.getElementById('flashcardPinyin').value);
            formData.append('meaning_en', document.getElementById('flashcardMeaningEn').value);
            formData.append('meaning_vi', document.getElementById('flashcardMeaningVi').value);
            formData.append('topic_id', document.getElementById('flashcardTopicId').value);
            formData.append('level_id', document.getElementById('flashcardLevelId').value);
            formData.append('is_premium', document.getElementById('flashcardPremium').value);

            const imageFile = document.getElementById('flashcardImage').files[0];
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const audioFile = document.getElementById('flashcardAudio').files[0];
            if (audioFile) {
                formData.append('audio', audioFile);
            }

            const response = await fetch(`${API_URL}/flashcards`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${adminToken}` },
                body: formData
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Tạo flashcard thất bại');
            }

            modal.hide();
            loadFlashcards();
            alert('Thêm flashcard thành công!');
        } catch (error) {
            alert('Lỗi: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Lưu';
        }
    });
}

async function editFlashcard(flashcardId) {
    try {
        const response = await fetch(`${API_URL}/flashcards/${flashcardId}`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await response.json();
        const flashcard = data.data || data;

        const modal = new bootstrap.Modal(document.getElementById('formModal'));

        // Fetch topics for dropdown
        let topics = [];
        try {
            const res = await fetch(`${API_URL}/topics`, {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            const topicsData = await res.json();
            topics = topicsData.data || [];
        } catch (err) {
            console.error('Error loading topics', err);
        }

        const topicOptions = [`<option value="0">Chưa phân loại</option>`]
            .concat(topics.map(t => `<option value="${t.id}" ${t.id === flashcard.topic ? 'selected' : ''}>${t.label}</option>`))
            .join('');

        const levelOptions = [
            { id: 'hsk1', label: 'HSK 1' },
            { id: 'hsk2', label: 'HSK 2' },
            { id: 'hsk3', label: 'HSK 3' },
            { id: 'hsk4', label: 'HSK 4' },
            { id: 'hsk5', label: 'HSK 5' },
            { id: 'hsk6', label: 'HSK 6' }
        ].map(l => `<option value="${l.id}" ${l.id === flashcard.level ? 'selected' : ''}>${l.label}</option>`).join('');

        document.getElementById('formTitle').textContent = 'Sửa Flashcard';
        document.getElementById('formBody').innerHTML = `
            <form id="editFlashcardForm">
                <div class="mb-3">
                    <label class="form-label">Hán tự</label>
                    <input type="text" class="form-control" id="editFlashcardHanzi" value="${flashcard.content.hanzi}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Pinyin</label>
                    <input type="text" class="form-control" id="editFlashcardPinyin" value="${flashcard.content.pinyin}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Nghĩa tiếng Anh</label>
                    <input type="text" class="form-control" id="editFlashcardMeaningEn" value="${(flashcard.content?.meanings?.en) || ''}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Nghĩa tiếng Việt</label>
                    <input type="text" class="form-control" id="editFlashcardMeaningVi" value="${(flashcard.content?.meanings?.vi) || ''}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Ảnh minh họa</label>
                    <div class="mb-2">
                        <img src="${flashcard.content.image_url || 'https://via.placeholder.com/100x100?text=No+Photo'}" alt="flashcard" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px;">
                    </div>
                    <input type="file" class="form-control" id="editFlashcardImage" accept="image/*">
                </div>
                <div class="mb-3">
                    <label class="form-label">Audio tiếng Trung</label>
                    <div class="mb-2">
                        ${flashcard.content.audio.cn ? `<audio controls preload="none" style="width: 100%;"><source src="${flashcard.content.audio.cn}" type="audio/mpeg">Audio</audio>` : '<span class="text-muted">Chưa có audio</span>'}
                    </div>
                    <input type="file" class="form-control" id="editFlashcardAudio" accept="audio/*">
                    <small class="text-muted">Nếu không upload, hệ thống sẽ regen TTS khi bạn đổi Hán tự.</small>
                </div>
                <div class="mb-3">
                    <label class="form-label">Topic</label>
                    <select class="form-select" id="editFlashcardTopicId">
                        ${topicOptions}
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Level</label>
                    <select class="form-select" id="editFlashcardLevelId" required>
                        ${levelOptions}
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Premium</label>
                    <select class="form-select" id="editFlashcardPremium">
                        <option value="0" ${!flashcard.is_premium ? 'selected' : ''}>Không</option>
                        <option value="1" ${flashcard.is_premium ? 'selected' : ''}>Có</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" id="submitEditFlashcard">Lưu</button>
            </form>
        `;
        modal.show();

        document.getElementById('editFlashcardForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitEditFlashcard');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang xử lý...';

            try {
                const formData = new FormData();
                formData.append('hanzi', document.getElementById('editFlashcardHanzi').value);
                formData.append('pinyin', document.getElementById('editFlashcardPinyin').value);
                formData.append('meaning_en', document.getElementById('editFlashcardMeaningEn').value);
                formData.append('meaning_vi', document.getElementById('editFlashcardMeaningVi').value);
                formData.append('topic_id', document.getElementById('editFlashcardTopicId').value);
                formData.append('level_id', document.getElementById('editFlashcardLevelId').value);
                formData.append('is_premium', document.getElementById('editFlashcardPremium').value);

                const imageFile = document.getElementById('editFlashcardImage').files[0];
                if (imageFile) {
                    formData.append('image', imageFile);
                }

                const audioFile = document.getElementById('editFlashcardAudio').files[0];
                if (audioFile) {
                    formData.append('audio', audioFile);
                }

                const response = await fetch(`${API_URL}/flashcards/${flashcardId}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${adminToken}` },
                    body: formData
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.error || 'Cập nhật flashcard thất bại');
                }

                modal.hide();
                loadFlashcards();
                alert('Cập nhật flashcard thành công!');
            } catch (error) {
                alert('Lỗi: ' + error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Lưu';
            }
        });
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

async function deleteFlashcard(flashcardId) {
    if (!confirm('Bạn chắc chắn muốn xóa flashcard này?')) return;

    try {
        await fetch(`${API_URL}/flashcards/${flashcardId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        loadFlashcards();
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

// Topics
async function loadTopics() {
    try {
        const response = await fetch(`${API_URL}/topics`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await response.json();

        const tbody = document.querySelector('#topicsTable tbody');
        tbody.innerHTML = '';
        data.data.forEach(topic => {
            tbody.innerHTML += `
                <tr>
                    <td>${topic.id}</td>
                    <td>${topic.label}</td>
                    <td>${topic.count}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editTopic('${topic.id}')">Sửa</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteTopic('${topic.id}')">Xóa</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error loading topics:', error);
    }
}

function showAddTopicForm() {
    const modal = new bootstrap.Modal(document.getElementById('formModal'));
    document.getElementById('formTitle').textContent = 'Thêm Topic';
    document.getElementById('formBody').innerHTML = `
        <form id="topicForm">
            <div class="mb-3">
                <label class="form-label">Tên Topic</label>
                <input type="text" class="form-control" id="topicLabel" required>
            </div>
            <button type="submit" class="btn btn-primary">Lưu</button>
        </form>
    `;
    modal.show();

    document.getElementById('topicForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const topicData = {
            id: Date.now().toString(),
            label: document.getElementById('topicLabel').value
        };

        try {
            await fetch(`${API_URL}/topics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(topicData)
            });
            modal.hide();
            loadTopics();
            alert('Thêm topic thành công!');
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    });
}

async function editTopic(topicId) {
    try {
        const response = await fetch(`${API_URL}/topics/${topicId}`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await response.json();
        const topic = data.data || data;

        const modal = new bootstrap.Modal(document.getElementById('formModal'));
        document.getElementById('formTitle').textContent = 'Sửa Topic';
        document.getElementById('formBody').innerHTML = `
            <form id="editTopicForm">
                <div class="mb-3">
                    <label class="form-label">Tên Topic</label>
                    <input type="text" class="form-control" id="editTopicLabel" value="${topic.label}" required>
                </div>
                <button type="submit" class="btn btn-primary" id="submitEditTopic">Lưu</button>
            </form>
        `;
        modal.show();

        document.getElementById('editTopicForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitEditTopic');
            submitBtn.disabled = true;

            try {
                const response = await fetch(`${API_URL}/topics/${topicId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${adminToken}`
                    },
                    body: JSON.stringify({ label: document.getElementById('editTopicLabel').value })
                });

                if (!response.ok) throw new Error('Cập nhật topic thất bại');

                modal.hide();
                loadTopics();
                alert('Cập nhật topic thành công!');
            } catch (error) {
                alert('Lỗi: ' + error.message);
            } finally {
                submitBtn.disabled = false;
            }
        });
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

async function deleteTopic(topicId) {
    if (!confirm('Bạn chắc chắn muốn xóa topic này?')) return;

    try {
        await fetch(`${API_URL}/topics/${topicId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        loadTopics();
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

// Levels
async function loadLevels() {
    try {
        const response = await fetch(`${API_URL}/levels`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await response.json();

        const tbody = document.querySelector('#levelsTable tbody');
        tbody.innerHTML = '';
        data.data.forEach(level => {
            tbody.innerHTML += `
                <tr>
                    <td>${level.id}</td>
                    <td>${level.label}</td>
                    <td>${level.count}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editLevel('${level.id}')">Sửa</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteLevel('${level.id}')">Xóa</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error loading levels:', error);
    }
}

function showAddLevelForm() {
    const modal = new bootstrap.Modal(document.getElementById('formModal'));
    document.getElementById('formTitle').textContent = 'Thêm Level';
    document.getElementById('formBody').innerHTML = `
        <form id="levelForm">
            <div class="mb-3">
                <label class="form-label">Tên Level</label>
                <input type="text" class="form-control" id="levelLabel" required>
            </div>
            <button type="submit" class="btn btn-primary">Lưu</button>
        </form>
    `;
    modal.show();

    document.getElementById('levelForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const levelData = {
            id: Date.now().toString(),
            label: document.getElementById('levelLabel').value
        };

        try {
            await fetch(`${API_URL}/levels`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(levelData)
            });
            modal.hide();
            loadLevels();
            alert('Thêm level thành công!');
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    });
}

async function editLevel(levelId) {
    try {
        const response = await fetch(`${API_URL}/levels/${levelId}`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await response.json();
        const level = data.data || data;

        const modal = new bootstrap.Modal(document.getElementById('formModal'));
        document.getElementById('formTitle').textContent = 'Sửa Level';
        document.getElementById('formBody').innerHTML = `
            <form id="editLevelForm">
                <div class="mb-3">
                    <label class="form-label">Tên Level</label>
                    <input type="text" class="form-control" id="editLevelLabel" value="${level.label}" required>
                </div>
                <button type="submit" class="btn btn-primary" id="submitEditLevel">Lưu</button>
            </form>
        `;
        modal.show();

        document.getElementById('editLevelForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitEditLevel');
            submitBtn.disabled = true;

            try {
                const response = await fetch(`${API_URL}/levels/${levelId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${adminToken}`
                    },
                    body: JSON.stringify({ label: document.getElementById('editLevelLabel').value })
                });

                if (!response.ok) throw new Error('Cập nhật level thất bại');

                modal.hide();
                loadLevels();
                alert('Cập nhật level thành công!');
            } catch (error) {
                alert('Lỗi: ' + error.message);
            } finally {
                submitBtn.disabled = false;
            }
        });
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

async function deleteLevel(levelId) {
    if (!confirm('Bạn chắc chắn muốn xóa level này?')) return;

    try {
        await fetch(`${API_URL}/levels/${levelId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        loadLevels();
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

// Badges
async function loadBadges() {
    try {
        const response = await fetch(`${API_URL}/badges`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await response.json();

        const tbody = document.querySelector('#badgesTable tbody');
        tbody.innerHTML = '';
        data.data.forEach(badge => {
            tbody.innerHTML += `
                <tr>
                    <td>${badge.id}</td>
                    <td>${badge.name}</td>
                    <td>${badge.icon || '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editBadge('${badge.id}')">Sửa</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteBadge('${badge.id}')">Xóa</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error loading badges:', error);
    }
}

function showAddBadgeForm() {
    const modal = new bootstrap.Modal(document.getElementById('formModal'));
    document.getElementById('formTitle').textContent = 'Thêm Badge';
    document.getElementById('formBody').innerHTML = `
        <form id="badgeForm">
            <div class="mb-3">
                <label class="form-label">Tên Badge</label>
                <input type="text" class="form-control" id="badgeName" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Mô tả</label>
                <textarea class="form-control" id="badgeDescription"></textarea>
            </div>
            <div class="mb-3">
                <label class="form-label">Icon URL</label>
                <input type="text" class="form-control" id="badgeIcon">
            </div>
            <button type="submit" class="btn btn-primary">Lưu</button>
        </form>
    `;
    modal.show();

    document.getElementById('badgeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const badgeData = {
            id: Date.now().toString(),
            name: document.getElementById('badgeName').value,
            description: document.getElementById('badgeDescription').value,
            icon: document.getElementById('badgeIcon').value
        };

        try {
            await fetch(`${API_URL}/badges`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(badgeData)
            });
            modal.hide();
            loadBadges();
            alert('Thêm badge thành công!');
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    });
}

async function editBadge(badgeId) {
    try {
        const response = await fetch(`${API_URL}/badges/${badgeId}`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const data = await response.json();
        const badge = data.data || data;

        const modal = new bootstrap.Modal(document.getElementById('formModal'));
        document.getElementById('formTitle').textContent = 'Sửa Badge';
        document.getElementById('formBody').innerHTML = `
            <form id="editBadgeForm">
                <div class="mb-3">
                    <label class="form-label">Tên Badge</label>
                    <input type="text" class="form-control" id="editBadgeName" value="${badge.name}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Mô tả</label>
                    <textarea class="form-control" id="editBadgeDescription">${badge.description || ''}</textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">Icon URL</label>
                    <input type="text" class="form-control" id="editBadgeIcon" value="${badge.icon || ''}">
                </div>
                <button type="submit" class="btn btn-primary" id="submitEditBadge">Lưu</button>
            </form>
        `;
        modal.show();

        document.getElementById('editBadgeForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitEditBadge');
            submitBtn.disabled = true;

            try {
                const badgeData = {
                    name: document.getElementById('editBadgeName').value,
                    description: document.getElementById('editBadgeDescription').value,
                    icon: document.getElementById('editBadgeIcon').value
                };

                const response = await fetch(`${API_URL}/badges/${badgeId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${adminToken}`
                    },
                    body: JSON.stringify(badgeData)
                });

                if (!response.ok) throw new Error('Cập nhật badge thất bại');

                modal.hide();
                loadBadges();
                alert('Cập nhật badge thành công!');
            } catch (error) {
                alert('Lỗi: ' + error.message);
            } finally {
                submitBtn.disabled = false;
            }
        });
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

async function deleteBadge(badgeId) {
    if (!confirm('Bạn chắc chắn muốn xóa badge này?')) return;

    try {
        await fetch(`${API_URL}/badges/${badgeId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        loadBadges();
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

// Logout
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    window.location.href = '/admin/login.html';
}

// Initialize
setAdminInfo();
loadDashboard();
