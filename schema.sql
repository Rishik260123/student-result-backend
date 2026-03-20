-- CREATE DATABASE IF NOT EXISTS StudentResultSystem;
-- USE StudentResultSystem;

DROP VIEW IF EXISTS AdminDashboard;

DROP PROCEDURE IF EXISTS AddStudent;
DROP PROCEDURE IF EXISTS AddSubject;
DROP PROCEDURE IF EXISTS AddAdmin;
DROP PROCEDURE IF EXISTS AddResult;
DROP PROCEDURE IF EXISTS GetStudentReport;
DROP PROCEDURE IF EXISTS GetFailingStudents;
DROP PROCEDURE IF EXISTS GetSubjectReport;
DROP PROCEDURE IF EXISTS MarkNotificationSent;
DROP PROCEDURE IF EXISTS ArchiveOldNotification;

DROP VIEW IF EXISTS AdminDashboard;
DROP TABLE IF EXISTS Notification;
DROP TABLE IF EXISTS Result;
DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS Subject;
DROP TABLE IF EXISTS Student;

CREATE TABLE Student(
    StudentID INT PRIMARY KEY AUTO_INCREMENT,
    StudentName VARCHAR(100) NOT NULL,
    Phone_Number VARCHAR(15),
    Email VARCHAR(100)
);

CREATE TABLE Subject(
    SubjectCode VARCHAR(10) PRIMARY KEY,
    SubjectName VARCHAR(100) NOT NULL
);

CREATE TABLE Admin(
    AdminID INT PRIMARY KEY AUTO_INCREMENT,
    AdminName VARCHAR(100) NOT NULL,
    AdminEmail VARCHAR(100)
);

CREATE TABLE Result(
    ResultID INT PRIMARY KEY AUTO_INCREMENT,
    MarksObtained INT,
    Grade CHAR(2),
    StudentID INT,
    SubjectCode VARCHAR(10),
    AdminID INT,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID) ON DELETE CASCADE,
    FOREIGN KEY (SubjectCode) REFERENCES Subject(SubjectCode) ON DELETE CASCADE,
    FOREIGN KEY (AdminID) REFERENCES Admin(AdminID) ON DELETE CASCADE
); 

CREATE TABLE Notification(
    AlertID INT PRIMARY KEY AUTO_INCREMENT,
    AlertStatus ENUM('Pending', 'Success', 'Failed') DEFAULT 'Pending',
    Channel VARCHAR(20),
    AlertTimeStamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ResultID INT,
    FOREIGN KEY (ResultID) REFERENCES Result(ResultID) ON DELETE CASCADE
);

DELIMITER //

CREATE TRIGGER After_Result_Insert
AFTER INSERT ON Result
FOR EACH ROW
BEGIN
    INSERT INTO Notification(AlertStatus, Channel, ResultID)
    VALUES("Pending", "Email", NEW.ResultID);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GetStudentReport(IN p_StudentID INT)
BEGIN
    SELECT
        s.StudentName,
        sub.SubjectName,
        r.MarksObtained,
        r.Grade
    FROM Student s
    JOIN Result r ON s.StudentID = r.StudentID
    JOIN Subject sub ON r.SubjectCode = sub.SubjectCode
    WHERE s.StudentID = p_StudentID;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE ArchiveOldNotification()
BEGIN 
    DELETE FROM Notification
    WHERE AlertStatus = 'Success'
    AND AlertTimeStamp < NOW() - INTERVAL 30 DAY;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GetSubjectReport(IN p_SubCode VARCHAR(10))
BEGIN
    SELECT
        SubjectCode,
        AVG(MarksObtained) AS AverageMarks,
        MAX(MarksObtained) AS TopScore,
        COUNT(*) AS TotalStudents
    FROM Result
    WHERE SubjectCode = p_SubCode
    GROUP BY SubjectCode;
END //

DELIMITER ;

DELIMITER //
CREATE PROCEDURE AddStudent(
    IN p_Name VARCHAR(100),
    IN p_Phone VARCHAR(15),
    IN p_Email VARCHAR(100)
)
BEGIN
    IF EXISTS (SELECT 1 FROM Student WHERE Email = p_Email) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Email already exists!';
    ELSE
        INSERT INTO Student (StudentName, Phone_Number, Email) 
        VALUES (p_Name, p_Phone, p_Email);
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE AddSubject(
    IN p_Code VARCHAR(10),
    IN p_Name VARCHAR(100)
)
BEGIN
    INSERT INTO Subject (SubjectCode, SubjectName) 
    VALUES (p_Code, p_Name);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE AddAdmin(
    IN p_Name VARCHAR(100),
    IN p_Email VARCHAR(100)
)
BEGIN
    INSERT INTO Admin (AdminName, AdminEmail) 
    VALUES (p_Name, p_Email);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetFailingStudents()
BEGIN
    SELECT
        s.StudentID,
        s.Email,
        sub.SubjectCode,
        r.MarksObtained
    FROM Student s
    JOIN Result r ON s.StudentID = r.StudentID
    JOIN Subject sub ON r.SubjectCode = sub.SubjectCode
    WHERE r.Grade = 'F';
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE MarkNotificationSent(IN p_AlertID INT)
BEGIN
    UPDATE Notification 
    SET AlertStatus = 'Success', AlertTimeStamp = NOW()
    WHERE AlertID = p_AlertID;
END //
DELIMITER ;

CREATE VIEW AdminDashboard AS
SELECT
    r.ResultID,
    s.StudentName,
    sub.SubjectName,
    r.MarksObtained,
    r.Grade,
    n.AlertStatus,
    n.AlertTimeStamp
FROM Result r
JOIN Student s ON r.StudentID = s.StudentID
JOIN Subject sub ON r.SubjectCode = sub.SubjectCode
JOIN Notification n ON r.ResultID = n.ResultID;

DELIMITER //

CREATE PROCEDURE AddResult(
    IN p_Marks INT,
    IN p_Grade CHAR(2),
    IN p_StudentID INT,
    IN p_SubCode VARCHAR(10),
    IN p_AdminID INT
)
BEGIN
    INSERT INTO Result (MarksObtained, Grade, StudentID, SubjectCode, AdminID)
    VALUES (p_Marks, p_Grade, p_StudentID, p_SubCode, p_AdminID);
END //

DELIMITER ;