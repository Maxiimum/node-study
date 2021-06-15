const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({   // super.init( {1번째 인수 : 테이블에 대한 설정} , )
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            age: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            married: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            comment: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },

        }, {                      // {2번째 인수 : 테이블 옵션}
            sequelize,            // static init 메서드의 매개변수와 연결되는 옵션 ( db. sequelize 객체)
            timestamps: false,    // true면 createdAt과 updatedAt 컬럼 추가. 지금은 직접 created_at을 만듬
            underscored: false,   // 시퀄라이즈는 기본적으로 테이블명과 컬럼명을 캐멀케이스로 만드는데 이를 스네이크 케이스로 바꿈
            modelName: 'User',    // 노드 프로젝트에서 사용
            tableNmae: 'users',   // 실제 데이터베이스의 테이블 이름, 기본적으로 소문자및 복수형 (User면 users)
            paranoid: false,      // true면 deletedAt 생성. 로우 삭제시 완전삭제가 아니라 deletedAt에 지운시각 기록.
            charst: 'utf8',                 // 한글 입력을 위해서 utf8, utf8_general_ci 
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.User.hasMany(db.Comment,{ foreignKey: 'commenter', sourceKey: 'id' });
    }
};